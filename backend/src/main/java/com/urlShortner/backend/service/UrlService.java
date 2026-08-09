package com.urlShortner.backend.service;

import com.urlShortner.backend.dto.UrlRequest;
import com.urlShortner.backend.dto.UrlResponse;
import com.urlShortner.backend.dto.UrlStatsResponse;
import com.urlShortner.backend.dto.UrlSummaryResponse;
import com.urlShortner.backend.entity.Url;
import com.urlShortner.backend.repository.UrlRepository;
import com.urlShortner.backend.util.Base62Encoder;
import com.urlShortner.backend.exception.CustomAliasAlreadyExistsException;
import com.urlShortner.backend.exception.UrlNotFoundException;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UrlService {

    private final UrlRepository urlRepository;
    private final CacheService cacheService;
    private final UrlValidatorService urlValidator;
    private final StatsService statsService;

    public UrlService(UrlRepository urlRepository, CacheService cacheService, UrlValidatorService urlValidator, StatsService statsService) {
        this.urlRepository = urlRepository;
        this.cacheService = cacheService;
        this.urlValidator = urlValidator;
        this.statsService = statsService;
    }

    public UrlResponse createShortUrl(UrlRequest request) {
        String customAlias = request.getCustomAlias();
        if (customAlias != null && customAlias.isBlank()) {
            customAlias = null;
        }

        if(customAlias!=null && !urlValidator.isValidCustomAlias(customAlias)) {
            throw new IllegalArgumentException("Custom alias must contain only alphanumeric characters, hyphens, and underscores");
        }

        if (customAlias != null && urlRepository.existsByCustomAlias(customAlias)) {
            throw new CustomAliasAlreadyExistsException("Custom alias already exists");
        }

        LocalDateTime expiresAt = null;
        if(request.getExpirationDays() != null) {
            expiresAt = LocalDateTime.now().plusDays(request.getExpirationDays());
        }

        try {
            Url url = Url.builder()
                    .originalUrl(request.getOriginalUrl())
                    .customAlias(customAlias)
                    .createdAt(LocalDateTime.now())
                    .expiresAt(expiresAt)
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
            if (customAlias != null) {
                throw new CustomAliasAlreadyExistsException("Custom alias already exists");
            }
            throw e;
        }
    }

    public String redirect(String shortCode) {

        Optional<String> cachedUrl = cacheService.getUrl(shortCode);
        if(cachedUrl.isPresent()) {
            statsService.recordClick(shortCode);
            return cachedUrl.get();
        }

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));

        urlValidator.validateNotExpired(url);
        cacheService.cacheUrl(shortCode, url.getOriginalUrl(), url.getExpiresAt());
        statsService.recordClick(shortCode);

        return url.getOriginalUrl();
    }

    public UrlStatsResponse getUrlStats(String shortCode) {
        return statsService.getUrlStats(shortCode);
    }

    public List<UrlSummaryResponse> getAllUrlsForAdmin() {
        return statsService.getAllUrlsForAdmin();
    }
}