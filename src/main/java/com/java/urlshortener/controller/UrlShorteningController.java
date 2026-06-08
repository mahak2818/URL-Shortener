package com.java.urlshortener.controller;

import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletResponse;
import com.java.urlshortener.model.Url;
import com.java.urlshortener.model.UrlDTO;
import com.java.urlshortener.model.UrlErrorResponseDTO;
import com.java.urlshortener.model.UrlResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.java.urlshortener.services.Urlservices;

import java.io.IOException;
import java.time.LocalDateTime;

@RestController
public class UrlShorteningController {

    @Autowired
    private Urlservices urlService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateShortLink(@RequestBody UrlDTO urlDTO)
    {
        Url urlToRet = urlService.generateShortLink(urlDTO);

        if(urlToRet != null)
        {
            UrlResponseDTO urlResponseDTO = new UrlResponseDTO();
            urlResponseDTO.setOriginalUrl(urlToRet.getOriginalUrl());
            urlResponseDTO.setExpirationDate(urlToRet.getExpirationDate());
            urlResponseDTO.setShortLink(urlToRet.getShortLink());
            return new ResponseEntity<UrlResponseDTO>(urlResponseDTO, HttpStatus.OK);
        }

        UrlErrorResponseDTO urlErrorResponseDTO = new UrlErrorResponseDTO();
        urlErrorResponseDTO.setStatus("404");
        urlErrorResponseDTO.setError("There was an error processing your request. please try again.");
        return new ResponseEntity<UrlErrorResponseDTO>(urlErrorResponseDTO,HttpStatus.OK);

    }

    @GetMapping("/{shortLink}")
    public ResponseEntity<?> redirectToOriginalUrl(@PathVariable String shortLink, HttpServletResponse response) throws IOException, IOException {

        if(StringUtils.isEmpty(shortLink))
        {
            UrlErrorResponseDTO urlErrorResponseDto = new UrlErrorResponseDTO();
            urlErrorResponseDto.setError("Invalid Url");
            urlErrorResponseDto.setStatus("400");
            return new ResponseEntity<UrlErrorResponseDTO>(urlErrorResponseDto,HttpStatus.OK);
        }
        Url urlToRet = urlService.getEncodedUrl(shortLink);

        if(urlToRet == null)
        {
            UrlErrorResponseDTO urlErrorResponseDto = new UrlErrorResponseDTO();
            urlErrorResponseDto.setError("Url does not exist or it might have expired!");
            urlErrorResponseDto.setStatus("400");
            return new ResponseEntity<UrlErrorResponseDTO>(urlErrorResponseDto,HttpStatus.OK);
        }

        if(urlToRet.getExpirationDate().isBefore(LocalDateTime.now()))
        {
            urlService.deleteShortLink(urlToRet);
            UrlErrorResponseDTO urlErrorResponseDto = new UrlErrorResponseDTO();
            urlErrorResponseDto.setError("Url Expired. Please try generating a fresh one.");
            urlErrorResponseDto.setStatus("200");
            return new ResponseEntity<UrlErrorResponseDTO>(urlErrorResponseDto,HttpStatus.OK);
        }

        response.sendRedirect(urlToRet.getOriginalUrl());
        return null;
    }
}
