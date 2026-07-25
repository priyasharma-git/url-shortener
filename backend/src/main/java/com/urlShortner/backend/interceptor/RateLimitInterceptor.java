package com.urlShortner.backend.interceptor;

import com.urlShortner.backend.service.RateLimitService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitService rateLimitService;

    public RateLimitInterceptor(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    @Override
    public boolean preHandle(
        HttpServletRequest request,
        HttpServletResponse response,
        Object Handler
    ) {
        String clientId = getClientId(request);
        rateLimitService.checkRateLimit(clientId);
        return true;
    }

    private String getClientId(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");

        if(ip==null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if(ip==null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        if(ip!=null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }

        return ip!=null ? ip : "unknown";
    }
    
}
