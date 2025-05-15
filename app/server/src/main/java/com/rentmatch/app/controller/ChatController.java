package com.rentmatch.app.controller;


import com.rentmatch.app.dao.ChatMessageRepository;
import com.rentmatch.app.dto.ChatMessageDTO;
import com.rentmatch.app.entity.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

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

    @GetMapping("/chatOtherUsers")
    public List<String> chatOtherUsers(Principal principal) {
       String username = principal.getName();
       return chatMessageRepository.findAllOtherUsers(username);
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
