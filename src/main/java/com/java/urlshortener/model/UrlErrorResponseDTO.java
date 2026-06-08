package com.java.urlshortener.model;

public class UrlErrorResponseDTO {

    private String status;
    private String error;

    public UrlErrorResponseDTO(String status, String error) {
        this.status = status;
        this.error = error;
    }

    public UrlErrorResponseDTO() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    @Override
    public String toString() {
        return "UrlErrorResponseDTO{" +
                "status='" + status + '\'' +
                ", error='" + error + '\'' +
                '}';
    }
}
