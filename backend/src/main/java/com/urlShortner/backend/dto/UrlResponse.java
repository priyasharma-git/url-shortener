package com.urlShortner.backend.dto;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@AllArgsConstructor
public class UrlResponse {
    private String shortCode;
    private String shortUrl;
    private LocalDateTime expiresAt;
}