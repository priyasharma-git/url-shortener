package com.urlShortner.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
public class UrlRequest {
    @NotBlank
    private String originalUrl;
    private String customAlias;
}