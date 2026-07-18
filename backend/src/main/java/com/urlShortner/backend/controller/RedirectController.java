package com.urlShortner.backend.controller;

import com.urlShortner.backend.service.UrlService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;


@RestController
public class RedirectController {


    private final UrlService urlService;


    public RedirectController(UrlService urlService) {
        this.urlService = urlService;
    }


    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(
            @PathVariable String shortCode
    ) {


        String originalUrl = urlService.redirect(shortCode);


        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(originalUrl))
                .build();
    }
}