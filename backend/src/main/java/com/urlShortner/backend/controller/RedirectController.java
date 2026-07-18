package com.urlShortner.backend.controller;

import com.urlShortner.backend.entity.Url;
import com.urlShortner.backend.repository.UrlRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
public class RedirectController {

    private final UrlRepository urlRepository;

    public RedirectController(UrlRepository urlRepository) {
        this.urlRepository = urlRepository;
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(
            @PathVariable String shortCode
    ) {

        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("URL not found"));


        if (url.getExpiresAt() != null &&
                url.getExpiresAt().isBefore(LocalDateTime.now())) {

            throw new RuntimeException("URL expired");
        }


        url.setClickCount(url.getClickCount() + 1);
        urlRepository.save(url);


        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(java.net.URI.create(url.getOriginalUrl()))
                .build();
    }
}