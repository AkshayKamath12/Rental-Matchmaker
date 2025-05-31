package com.rentmatch.app.matchesResponse;


import java.util.List;

public class Response {
    private List<String> names;
    private List<Double> scores;

    public Response(List<String> names, List<Double> scores) {
        this.names = names;
        this.scores = scores;
    }

    public Response() {}

    public List<String> getNames() {
        return names;
    }

    public void setNames(List<String> names) {
        this.names = names;
    }

    public List<Double> getScores() {
        return scores;
    }

    public void setScores(List<Double> scores) {
        this.scores = scores;
    }
}
