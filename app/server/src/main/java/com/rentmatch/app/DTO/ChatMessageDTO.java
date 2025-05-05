package com.rentmatch.app.dto;

import lombok.Data;

@Data
public class ChatMessageDTO {
    private String sender;
    private String recipient;
    private String content;
}
