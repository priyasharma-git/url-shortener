package com.urlShortner.backend.interceptor;

import com.urlShortner.backend.service.RateLimitService;
import com.urlShortner.backend.util.ClientIdentifierService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitService rateLimitService;
    private final ClientIdentifierService clientIdentifierService;

    public RateLimitInterceptor(RateLimitService rateLimitService, ClientIdentifierService clientIdentifierService) {
        this.rateLimitService = rateLimitService;
        this.clientIdentifierService = clientIdentifierService;
    }

    @Override
    public boolean preHandle(
        HttpServletRequest request,
        HttpServletResponse response,
        Object Handler
    ) {
        String clientId = clientIdentifierService.getClientId(request);
        rateLimitService.checkRateLimit(clientId);
        return true;
    }
}
