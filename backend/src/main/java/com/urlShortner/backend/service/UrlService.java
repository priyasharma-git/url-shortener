package com.urlShortner.backend.service;

import com.urlShortner.backend.dto.UrlRequest;
import com.urlShortner.backend.dto.UrlResponse;
import com.urlShortner.backend.dto.UrlStatsResponse;
import com.urlShortner.backend.entity.Url;
import com.urlShortner.backend.repository.UrlRepository;
import com.urlShortner.backend.util.Base62Encoder;
import com.urlShortner.backend.exception.CustomAliasAlreadyExistsException;
import com.urlShortner.backend.exception.UrlExpiredException;
import com.urlShortner.backend.exception.UrlNotFoundException;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
public class UrlService {

    private final UrlRepository urlRepository;
    private final RedisTemplate<String, String> redisTemplate;

    public UrlService(UrlRepository urlRepository, RedisTemplate<String, String> redisTemplate) {
        this.urlRepository = urlRepository;
        this.redisTemplate = redisTemplate;
    }

    public UrlResponse createShortUrl(UrlRequest request) {

        if (request.getCustomAlias() != null &&
                !request.getCustomAlias().isBlank() &&
                urlRepository.existsByCustomAlias(request.getCustomAlias())) {

            throw new CustomAliasAlreadyExistsException("Custom alias already exists");
        }

        Url url = Url.builder()
                .originalUrl(request.getOriginalUrl())
                .customAlias(request.getCustomAlias())
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(30))
                .clickCount(0L)
                .build();

        Url savedUrl = urlRepository.save(url);

        String shortCode;

        if (request.getCustomAlias() != null &&
                !request.getCustomAlias().isBlank()) {

            shortCode = request.getCustomAlias();

        } else {

            shortCode = Base62Encoder.encode(savedUrl.getId());

        }

        savedUrl.setShortCode(shortCode);

        urlRepository.save(savedUrl);

        return new UrlResponse(
                shortCode,
                "http://localhost:8080/" + shortCode,
                savedUrl.getExpiresAt());
    }

    public String redirect(String shortCode) {

        String cachedUrl = redisTemplate.opsForValue()
                .get(shortCode);

        if (cachedUrl != null) {
            incrementClickCount(shortCode);
            return cachedUrl;
        }

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));

        if (url.getExpiresAt() != null &&
                url.getExpiresAt().isBefore(LocalDateTime.now())) {

            throw new UrlExpiredException("URL expired");
        }

        
        if(url.getExpiresAt() != null) {
            long ttlSeconds = Duration.between(LocalDateTime.now(), url.getExpiresAt()).getSeconds();
            if(ttlSeconds > 0) {
                redisTemplate.opsForValue().set(shortCode, url.getOriginalUrl(), ttlSeconds, TimeUnit.SECONDS);
            }
        } else {
            redisTemplate.opsForValue()
                .set(shortCode, url.getOriginalUrl(), 30, TimeUnit.DAYS);
        }

        url.setClickCount(
                url.getClickCount() + 1);

        urlRepository.save(url);

        return url.getOriginalUrl();
    }

    @Async
    public void incrementClickCount(String shortCode) {
        urlRepository.findByShortCode(shortCode).ifPresent(url -> {
            url.setClickCount(url.getClickCount() + 1);
            urlRepository.save(url);
        });
    }

    public UrlStatsResponse getUrlStats(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode).orElseThrow(() -> new UrlNotFoundException("URL not found"));

        boolean isExpired = url.getExpiresAt() != null && url.getExpiresAt().isBefore(LocalDateTime.now());

        return new UrlStatsResponse(
            url.getShortCode(),
            url.getOriginalUrl(),
            url.getClickCount(),
            url.getCreatedAt(),
            url.getExpiresAt(),
            isExpired,
            url.getCustomAlias()
        );
    }
}