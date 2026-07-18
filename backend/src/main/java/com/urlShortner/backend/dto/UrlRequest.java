package com.urlShortner.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class UrlRequest {

    @NotBlank
    private String originalUrl;

    private String customAlias;

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getCustomAlias() {
        return customAlias;
    }

    public void setCustomAlias(String customAlias) {
        this.customAlias = customAlias;
    }
}