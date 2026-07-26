package com.urlShortner.backend.controller;

import com.urlShortner.backend.dto.UrlRequest;
import com.urlShortner.backend.dto.UrlResponse;
import com.urlShortner.backend.dto.UrlStatsResponse;
import com.urlShortner.backend.dto.UrlSummaryResponse;
import com.urlShortner.backend.service.UrlService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/urls")
public class UrlController {

    private final UrlService urlService;

    public UrlController(UrlService urlService) {
        this.urlService = urlService;
    }


    @PostMapping
    public UrlResponse createShortUrl(
            @Valid @RequestBody UrlRequest request
    ) {
        return urlService.createShortUrl(request);
    }

    @GetMapping("/{shortCode}/stats")
    public UrlStatsResponse getUrlStats(
        @PathVariable String shortCode
    ) {
        return urlService.getUrlStats(shortCode);
    }

    @GetMapping("/admin/list")
    public List<UrlSummaryResponse> getAllUrlsForAdmin() {
        return urlService.getAllUrlsForAdmin();
    }
}