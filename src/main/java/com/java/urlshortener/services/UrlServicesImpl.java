package com.java.urlshortener.services;

import com.google.common.hash.Hashing;
import com.java.urlshortener.model.Url;
import com.java.urlshortener.model.UrlDTO;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.java.urlshortener.repository.UrlRepo;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

@Component
public class UrlServicesImpl implements  Urlservices{

    private static final Logger logger = LoggerFactory.getLogger(UrlServicesImpl.class);
    @Autowired
    private UrlRepo urlRepository;

    @Override
    public Url generateShortLink(UrlDTO urlDto) {

        if(StringUtils.isNotEmpty(urlDto.getUrl()))
        {
            String encodedUrl = encodeUrl(urlDto.getUrl());
            Url urlToPersist = new Url();
            urlToPersist.setCreationDate(LocalDateTime.now());
            urlToPersist.setOriginalUrl(urlDto.getUrl());
            urlToPersist.setShortLink(encodedUrl);
            urlToPersist.setExpirationDate(getExpirationDate(urlDto.getExpirationDate(),urlToPersist.getCreationDate()));
            Url urlToRet = persistShortLink(urlToPersist);

            if(urlToRet != null)
                return urlToRet;

            return null;
        }
        return null;
    }

    // Handles both "2026-06-08T11:30" (no seconds, from datetime-local input)
    // and full ISO format "2026-06-08T11:30:00"
    private static final DateTimeFormatter FLEXIBLE_FORMATTER = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd'T'HH:mm")
            .optionalStart()
            .appendPattern(":ss")
            .optionalEnd()
            .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
            .toFormatter();

    private LocalDateTime getExpirationDate(String expirationDate, LocalDateTime creationDate)
    {
        if(StringUtils.isBlank(expirationDate))
        {
            // Default: 5 minutes from now
            return creationDate.plusMinutes(5);
        }
        try {
            return LocalDateTime.parse(expirationDate, FLEXIBLE_FORMATTER);
        } catch (Exception e) {
            logger.warn("Could not parse expiration date '{}', using default 5 min", expirationDate);
            return creationDate.plusMinutes(5);
        }
    }

    private String encodeUrl(String url)
    {
        String encodedUrl = "";
        LocalDateTime time = LocalDateTime.now();
        encodedUrl = Hashing.murmur3_32_fixed()
                .hashString(url.concat(time.toString()), StandardCharsets.UTF_8)
                .toString();
        return  encodedUrl;
    }

    @Override
    public Url persistShortLink(Url url) {
        Url urlToRet = urlRepository.save(url);
        return urlToRet;
    }

    @Override
    public Url getEncodedUrl(String url) {
        Url urlToRet = urlRepository.findByShortLink(url);
        return urlToRet;
    }


    @Override
    public void deleteShortLink(Url url) {

        urlRepository.delete(url);
    }
}

