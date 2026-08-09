package com.urlShortner.backend.service;

import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

import com.urlShortner.backend.repository.UrlRepository;
import com.urlShortner.backend.dto.UrlStatsResponse;
import com.urlShortner.backend.dto.UrlSummaryResponse;
import com.urlShortner.backend.entity.Url;
import com.urlShortner.backend.exception.UrlNotFoundException;

@Service
public class StatsService {
    private final UrlRepository urlRepository;

    public StatsService(UrlRepository urlRepository) {
        this.urlRepository = urlRepository;
    }

    @Async
    public void recordClick(String shortCode) {
        urlRepository.incrementClickCount(shortCode);
    }

    public UrlStatsResponse getUrlStats(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("URL not found"));
        
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

    public List<UrlSummaryResponse> getAllUrlsForAdmin() {
        return urlRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
        .stream()
        .map(url -> new UrlSummaryResponse(
            url.getShortCode(),
            url.getOriginalUrl(),
            url.getClickCount(),
            url.getCreatedAt(),
            url.getExpiresAt(),
            url.getCustomAlias()
        ))
        .toList();
    }
}