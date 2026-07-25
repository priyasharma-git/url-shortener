package com.urlShortner.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
public class UrlRequest {
    @NotBlank
    private String originalUrl;
    
    @Size(max = 50, message = "Custom alias must not exceed 50 characters")
    private String customAlias;
}