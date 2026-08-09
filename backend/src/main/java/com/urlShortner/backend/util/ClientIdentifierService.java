package com.urlShortner.backend.util;

import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class ClientIdentifierService {
    public String getClientId(HttpServletRequest request) {
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
