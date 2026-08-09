package com.urlShortner.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.time.LocalDateTime;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
public class CacheService {

    private static final Logger log = LoggerFactory.getLogger(CacheService.class);
    private final RedisTemplate<String, String> redisTemplate;

    public CacheService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public Optional<String> getUrl(String shortCode) {
        try {
            String cachedUrl = redisTemplate.opsForValue().get(shortCode);
            return Optional.ofNullable(cachedUrl);
        } catch (Exception e) {
            log.warn("Redis read failed for shortCode {}: {}", shortCode, e.getMessage());
            return Optional.empty();
        }
    }

    public void cacheUrl(String shortCode, String originalUrl, LocalDateTime expiresAt) {
        try {
            if (expiresAt != null) {
                long ttlSeconds = Duration.between(LocalDateTime.now(), expiresAt).getSeconds();
                if (ttlSeconds > 0) {
                    redisTemplate.opsForValue().set(shortCode, originalUrl, ttlSeconds, TimeUnit.SECONDS);
                }
            } else {
                redisTemplate.opsForValue().set(shortCode, originalUrl, 30, TimeUnit.DAYS);
            }
        } catch (Exception e) {
            log.warn("Redis write failed for shortCode {}: {}", shortCode, e.getMessage());
        }
    }

    public Long increment(String key) {
        try {
            return redisTemplate.opsForValue().increment(key);
        } catch (Exception e) {
            log.warn("Redis increment failed for key {}: {}", key, e.getMessage());
            return null;
        }
    }

    public void expire(String key, long timeout, TimeUnit unit) {
        try {
            redisTemplate.expire(key, timeout, unit);
        } catch (Exception e) {
            log.warn("Redis expire failed for key {}: {}", key, e.getMessage());
        }
    }
}
