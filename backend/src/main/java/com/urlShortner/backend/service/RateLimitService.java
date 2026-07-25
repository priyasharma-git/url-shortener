package com.urlShortner.backend.service;

import java.util.concurrent.TimeUnit;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.urlShortner.backend.exception.RateLimitExceededException;

@Service
public class RateLimitService {
    
    private final RedisTemplate<String, String> redisTemplate;

    private static final int MAX_REQUESTS_PER_MINUTE = 10;
    private static final int MAX_REQUESTS_PER_HOUR = 100;

    public RateLimitService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void checkRateLimit(String clientId) {
        String minuteKey = "rate_limit:minute" + clientId;
        String hourKey = "rate_limit:hour" + clientId;

        Long minuteCount = redisTemplate.opsForValue().increment(minuteKey);
        if(minuteCount == 1) {
            redisTemplate.expire(minuteKey, 1, TimeUnit.MINUTES);
        }
        if(minuteCount != null && minuteCount > MAX_REQUESTS_PER_MINUTE) {
            throw new RateLimitExceededException(
                "Rate limit exceeded: Maximum " + MAX_REQUESTS_PER_MINUTE + " requests per minute"
            );
        }

        Long hourCount = redisTemplate.opsForValue().increment(hourKey);
        if(hourCount==1) {
            redisTemplate.expire(hourKey, 1, TimeUnit.HOURS);
        }
        if(hourCount != null && hourCount > MAX_REQUESTS_PER_HOUR) {
            throw new RateLimitExceededException(
                "Rate limit exceeded: Maximum " + MAX_REQUESTS_PER_HOUR + " requests per hour"
            );
        }
    }
}
