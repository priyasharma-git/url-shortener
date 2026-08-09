package com.urlShortner.backend.service;

import com.urlShortner.backend.entity.Url;
import com.urlShortner.backend.exception.UrlExpiredException;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class UrlValidatorService {
    public void validateNotExpired(Url url) {
        if (url.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new UrlExpiredException("URL expired");
        }
    }

    public boolean isValidCustomAlias(String alias) {
        if(alias == null || alias.isBlank()) {
            return false;
        }
        return alias.matches("^[a-zA-Z0-9_-]{1,50}$");
    }
}
