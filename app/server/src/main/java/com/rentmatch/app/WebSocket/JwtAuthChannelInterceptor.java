package com.rentmatch.app.WebSocket;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class JwtAuthChannelInterceptor implements ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            Authentication auth = (Authentication) accessor.getSessionAttributes().get("user");
            System.out.println("WebSocket CONNECT for: " + auth.getName());
            System.out.println("connected user" + accessor.getUser());
            if (auth != null) {
                accessor.setUser(auth);
                SecurityContextHolder.getContext().setAuthentication(auth);
            } else {
                System.out.println("no auth");
                return null;
            }
        }
        return message;
    }
}
