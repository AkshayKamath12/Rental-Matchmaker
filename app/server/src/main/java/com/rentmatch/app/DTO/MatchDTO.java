package com.rentmatch.app.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class MatchDTO {
    private String username;
    private Double score;

    public MatchDTO(String username, Double score) {
        this.username = username;
        this.score = score;
    }
}
