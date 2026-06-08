package com.java.urlshortener.config;

import com.java.urlshortener.repository.UrlRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Warms up Hibernate EntityManagerFactory and the JPA repository
 * by running a simple COUNT query immediately after startup.
 * This prevents the first real user request from paying the
 * cold-start penalty (~300-500 ms).
 */
@Component
public class StartupWarmup {

    private static final Logger log = LoggerFactory.getLogger(StartupWarmup.class);

    @Autowired
    private UrlRepo urlRepo;

    @EventListener(ApplicationReadyEvent.class)
    public void warmUp() {
        try {
            long count = urlRepo.count();
            log.info("Warmup complete — DB reachable, {} URLs stored.", count);
        } catch (Exception e) {
            log.warn("Warmup query failed (non-fatal): {}", e.getMessage());
        }
    }
}
