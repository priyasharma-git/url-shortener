package com.urlShortner.backend.service;

import com.urlShortner.backend.dto.UrlRequest;
import com.urlShortner.backend.dto.UrlResponse;
import com.urlShortner.backend.dto.UrlStatsResponse;
import com.urlShortner.backend.dto.UrlSummaryResponse;
import com.urlShortner.backend.entity.Url;
import com.urlShortner.backend.repository.UrlRepository;
import com.urlShortner.backend.util.Base62Encoder;
import com.urlShortner.backend.exception.CustomAliasAlreadyExistsException;
import com.urlShortner.backend.exception.UrlExpiredException;
import com.urlShortner.backend.exception.UrlNotFoundException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.data.domain.Sort;

@Service
public class UrlService {

    private final UrlRepository urlRepository;
    private final RedisTemplate<String, String> redisTemplate;

    public UrlService(UrlRepository urlRepository, RedisTemplate<String, String> redisTemplate) {
        this.urlRepository = urlRepository;
        this.redisTemplate = redisTemplate;
    }

    public UrlResponse createShortUrl(UrlRequest request) {
        String customAlias = request.getCustomAlias();
        if (customAlias != null && customAlias.isBlank()) {
            customAlias = null;
        }

        if (customAlias != null && urlRepository.existsByCustomAlias(customAlias)) {
            throw new CustomAliasAlreadyExistsException("Custom alias already exists");
        }

        try {
            Url url = Url.builder()
                    .originalUrl(request.getOriginalUrl())
                    .customAlias(customAlias)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusDays(30))
                    .clickCount(0L)
                    .build();

            Url savedUrl = urlRepository.save(url);
            String shortCode;

            if (customAlias != null) {
                shortCode = customAlias;
            } else {
                shortCode = Base62Encoder.encode(savedUrl.getId());
            }

            savedUrl.setShortCode(shortCode);

            urlRepository.save(savedUrl);

            return new UrlResponse(
                    shortCode,
                    "http://localhost:8080/" + shortCode,
                    savedUrl.getExpiresAt());
        } catch (DataIntegrityViolationException e) {
            if(customAlias != null) {
                throw new CustomAliasAlreadyExistsException("Custom alias already exists");
            }
            throw e;
        }

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

        if (url.getExpiresAt() != null) {
            long ttlSeconds = Duration.between(LocalDateTime.now(), url.getExpiresAt()).getSeconds();
            if (ttlSeconds > 0) {
                redisTemplate.opsForValue().set(shortCode, url.getOriginalUrl(), ttlSeconds, TimeUnit.SECONDS);
            }
        } else {
            redisTemplate.opsForValue()
                    .set(shortCode, url.getOriginalUrl(), 30, TimeUnit.DAYS);
        }

        urlRepository.incrementClickCount(shortCode);

        urlRepository.save(url);

        return url.getOriginalUrl();
    }

    @Async
    public void incrementClickCount(String shortCode) {
        urlRepository.incrementClickCount(shortCode);
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
                url.getCustomAlias());
    }

    public List<UrlSummaryResponse> getAllUrlsForAdmin() {
        return urlRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(url -> new UrlSummaryResponse(
                        url.getShortCode(),
                        url.getOriginalUrl(),
                        url.getClickCount(),
                        url.getCreatedAt(),
                        url.getExpiresAt(),
                        url.getCustomAlias()))
                .toList();
    }
}