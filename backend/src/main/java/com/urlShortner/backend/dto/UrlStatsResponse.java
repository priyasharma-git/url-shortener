package com.urlShortner.backend.dto;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@AllArgsConstructor
public class UrlStatsResponse {
    private String shortCode;
    private String originalUrl;
    private Long clickCount;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private boolean isExpired;
    private String customAlias;
}
