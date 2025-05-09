package com.rentmatch.app.controller;

import com.rentmatch.app.dao.ChatMessageRepository;
import com.rentmatch.app.dto.ChatMessageDTO;
import com.rentmatch.app.entity.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Stack;

@RestController
@RequestMapping("/api/chats")
public class ChatController {
    private SimpMessagingTemplate messagingTemplate;
    private ChatMessageRepository chatMessageRepository;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatMessageRepository chatMessageRepository) {
        this.messagingTemplate = messagingTemplate;
        this.chatMessageRepository = chatMessageRepository;
    }

    @GetMapping("/chatHistory/{otherUser}")
    public List<ChatMessage> chatHistory(@PathVariable String otherUser, Principal principal) {
        String username = principal.getName();
        return chatMessageRepository.findChatBetweenUsers(username, otherUser);
    }

    @MessageMapping("/private")
    public void privateMessage(Principal principal, ChatMessageDTO msg) {
        String sender = principal.getName();
        String receiver = msg.getRecipient();
        ChatMessage chatMessage = new ChatMessage(sender, receiver, msg.getContent(), LocalDateTime.now());
        chatMessageRepository.save(chatMessage);
        messagingTemplate.convertAndSendToUser(
                receiver, "/queue/reply", msg);
    }
}
