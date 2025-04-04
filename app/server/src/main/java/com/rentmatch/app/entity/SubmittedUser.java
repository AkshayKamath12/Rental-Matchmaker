package com.rentmatch.app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "SubmittedUser")
public class SubmittedUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "username")
    private String username;

    public SubmittedUser() {}

    public SubmittedUser(String user) {
        this.username = user;
    }
}
