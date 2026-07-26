package com.urlShortner.backend.dto;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@AllArgsConstructor
public class UrlSummaryResponse {
    private String shortCode;
    private String originalUrl;
    private Long clickCount;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private String customAlias;
}