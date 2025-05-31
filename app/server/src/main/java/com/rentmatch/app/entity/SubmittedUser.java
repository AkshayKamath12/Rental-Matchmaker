package com.rentmatch.app.entity;

import jakarta.persistence.*;

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

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
