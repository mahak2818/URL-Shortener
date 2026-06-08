package com.java.urlshortener.services;

import com.java.urlshortener.model.Url;
import com.java.urlshortener.model.UrlDTO;
import org.springframework.stereotype.Service;

@Service
public interface Urlservices {

    public Url generateShortLink(UrlDTO url);
    public Url persistShortLink(Url url);
    public Url getEncodedUrl(String url);
    public void deleteShortLink(Url url);
}
