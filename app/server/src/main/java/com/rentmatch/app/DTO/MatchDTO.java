package com.rentmatch.app.DTO;

public class MatchDTO {
    private String username;
    private Double score;

    public MatchDTO(String username, Double score) {
        this.username = username;
        this.score = score;
    }

    public MatchDTO() {

    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }
}
