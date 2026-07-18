package com.urlShortner.backend.controller;

import com.urlShortner.backend.entity.Url;
import com.urlShortner.backend.service.UrlService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/url")
@CrossOrigin(origins = "*")
public class UrlController {

    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }

    @PostMapping("/shorten")
    public Url shortenUrl(@RequestBody String originalUrl) {
        return urlService.createShortUrl(originalUrl);
    }
}