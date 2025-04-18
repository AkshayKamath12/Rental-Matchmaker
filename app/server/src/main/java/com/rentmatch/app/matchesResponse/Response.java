package com.rentmatch.app.matchesResponse;

import lombok.Data;

import java.util.List;

@Data
public class Response {
    private List<String> names;
    private List<Double> scores;

    public Response(List<String> names, List<Double> scores) {
        this.names = names;
        this.scores = scores;
    }
}
