package com.urlShortner.backend.dto;

import java.time.LocalDateTime;

public class UrlResponse {

    private String shortCode;

    private String shortUrl;

    private LocalDateTime expiresAt;


    public UrlResponse(String shortCode, String shortUrl, LocalDateTime expiresAt) {
        this.shortCode = shortCode;
        this.shortUrl = shortUrl;
        this.expiresAt = expiresAt;
    }

    public String getShortCode() {
        return shortCode;
    }

    public String getShortUrl() {
        return shortUrl;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
}