package com.rentmatch.app.entity;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String username;
    private int question;
    private int answer;
    private int weight;

    public Question() {

    }

    public Question(int question, int answer, int weight, String username) {
        this.question = question;
        this.answer = answer;
        this.weight = weight;
        this.username = username;
    }
}
