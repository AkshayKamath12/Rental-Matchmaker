package com.rentmatch.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Table(name = "messages")
public class ChatMessage{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fromUser;
    private String toUser;
    private String content;
    private LocalDateTime timestamp;

    public ChatMessage(String fromUser, String toUser, String content, LocalDateTime timestamp) {
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.content = content;
        this.timestamp = timestamp;
    }
}