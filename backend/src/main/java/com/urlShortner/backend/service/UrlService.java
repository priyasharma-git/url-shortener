package com.urlShortner.backend.service;

import com.urlShortner.backend.dto.UrlRequest;
import com.urlShortner.backend.dto.UrlResponse;
import com.urlShortner.backend.entity.Url;
import com.urlShortner.backend.repository.UrlRepository;
import com.urlShortner.backend.util.Base62Encoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UrlService {

    private final UrlRepository urlRepository;

    public UrlService(UrlRepository urlRepository) {
        this.urlRepository = urlRepository;
    }


    public UrlResponse createShortUrl(UrlRequest request) {

        Url url = Url.builder()
                .originalUrl(request.getOriginalUrl())
                .customAlias(request.getCustomAlias())
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(30))
                .clickCount(0L)
                .build();


        Url savedUrl = urlRepository.save(url);


        String shortCode;

        if (request.getCustomAlias() != null &&
                !request.getCustomAlias().isBlank()) {

            shortCode = request.getCustomAlias();

        } else {

            shortCode = Base62Encoder.encode(savedUrl.getId());

        }


        savedUrl.setShortCode(shortCode);

        urlRepository.save(savedUrl);


        return new UrlResponse(
                shortCode,
                "http://localhost:8080/" + shortCode,
                savedUrl.getExpiresAt()
        );
    }
}