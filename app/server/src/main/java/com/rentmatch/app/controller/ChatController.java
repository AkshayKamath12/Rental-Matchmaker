package com.rentmatch.app.controller;

import com.rentmatch.app.entity.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class ChatController {
    private SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/private")
    public void privateMessage(Principal principal, ChatMessage msg) {
        String toUser = msg.getToUser(); // target username
        msg.setFromUser(principal.getName());
        messagingTemplate.convertAndSendToUser(
                toUser, "/queue/reply", msg);
    }
}
