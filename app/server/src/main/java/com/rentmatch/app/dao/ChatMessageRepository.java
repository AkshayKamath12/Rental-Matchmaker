package com.rentmatch.app.dao;

import com.rentmatch.app.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("SELECT m from ChatMessage m where " +
            "(m.fromUser = :user1 AND m.toUser = :user2) OR " +
            "(m.fromUser = :user2 AND m.toUser = :user1)" +
            "ORDER BY m.timestamp ASC")
    List<ChatMessage> findChatBetweenUsers(@Param("user1") String user1, @Param("user2") String user2);
}
