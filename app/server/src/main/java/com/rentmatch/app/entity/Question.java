package com.rentmatch.app.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "username")
    private String username;

    @Column(name = "question")
    private int question;

    @Column(name = "answer")
    private int answer;

    @Column(name = "weight")
    private int weight;

    public Question() {

    }

    public Question(int question, int answer, int weight, String username) {
        this.question = question;
        this.answer = answer;
        this.weight = weight;
        this.username = username;
    }

    public int getQuestion() {
        return question;
    }

    public void setQuestion(int question) {
        this.question = question;
    }

    public int getAnswer() {
        return answer;
    }

    public void setAnswer(int answer) {
        this.answer = answer;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String toString() {
        return "Question{" +
                "question=" + question +
                ", answer=" + answer +
                ", weight=" + weight +
                '}';
    }
}
