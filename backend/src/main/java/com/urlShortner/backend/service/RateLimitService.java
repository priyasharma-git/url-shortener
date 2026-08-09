package com.urlShortner.backend.service;

import java.util.concurrent.TimeUnit;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.stereotype.Service;

import com.urlShortner.backend.exception.RateLimitExceededException;

@Service
public class RateLimitService {

    private static final Logger log = LoggerFactory.getLogger(RateLimitService.class);
    private final CacheService cacheService;

    private static final int MAX_REQUESTS_PER_MINUTE = 10;
    private static final int MAX_REQUESTS_PER_HOUR = 100;

    public RateLimitService(CacheService cacheService) {
        this.cacheService = cacheService;
    }

    public void checkRateLimit(String clientId) {
        String minuteKey = "rate_limit:minute" + clientId;
        String hourKey = "rate_limit:hour" + clientId;

        Long minuteCount = cacheService.increment(minuteKey);
        if (minuteCount != null) {
            if (minuteCount == 1) {
                cacheService.expire(minuteKey, 1, TimeUnit.MINUTES);
            }
            if (minuteCount > MAX_REQUESTS_PER_MINUTE) {
                throw new RateLimitExceededException(
                        "Rate limit exceeded: Maximum " + MAX_REQUESTS_PER_MINUTE + " requests per minute");
            }
        } else {
            log.warn("Rate limiting unavailable (Redis down) for client: {}", clientId);
        }

        Long hourCount = cacheService.increment(hourKey);
        if(hourCount != null) {
            if (hourCount == 1) {
                cacheService.expire(hourKey, 1, TimeUnit.HOURS);
            }
            if (hourCount > MAX_REQUESTS_PER_HOUR) {
                throw new RateLimitExceededException(
                        "Rate limit exceeded: Maximum " + MAX_REQUESTS_PER_HOUR + " requests per hour");
            }
        } else {
            log.warn("Rate limiting unavailable (Redis down) for client: {}", clientId);
        }
    }
}
