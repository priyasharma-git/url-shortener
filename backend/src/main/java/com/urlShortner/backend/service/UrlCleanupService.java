package com.urlShortner.backend.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.urlShortner.backend.repository.UrlRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Service
@ConditionalOnProperty(name = "url.cleanup.enabled", havingValue = "true", matchIfMissing = true)
public class UrlCleanupService {
    private static final Logger log = LoggerFactory.getLogger(UrlCleanupService.class);
    private final UrlRepository urlRepository;

    public UrlCleanupService(UrlRepository urlRepository) {
        this.urlRepository = urlRepository;
    }

    @Scheduled(cron = "${url.cleanup.cron:0 0 2 * * ?}")
    @Transactional
    public void cleanupExpiredUrls() {
        log.info("Starting cleanup of expired URLs");
        try {
            LocalDateTime now = LocalDateTime.now();
            int deletedCount = urlRepository.deleteByExpiresAtBefore(now);
            log.info("Cleanup completed. Deleted {} expired URLs.", deletedCount);
        } catch (Exception e) {
            log.error("Error occurred while cleaning up expired URLs", e);
        }
    }
}
