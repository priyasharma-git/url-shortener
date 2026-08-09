package com.urlShortner.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
public class UrlRequest {
    @NotBlank
    @URL(message = "Invalid URL format")
    @Size(max=2048, message = "URL too long")
    private String originalUrl;
    
    @Size(max = 50, message = "Custom alias must not exceed 50 characters")
    private String customAlias;

    @Min(value = 1, message = "Expiration days must be at least 1")
    @Max(value = 365, message = "Expiration days must not exceed 365")
    private Integer expirationDays;
}