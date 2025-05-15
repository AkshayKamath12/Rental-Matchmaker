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

    //gets all users that converse with the user in the parameter; ensure only unique values get returned
    @Query("SELECT DISTINCT CASE " +
            "WHEN m.fromUser = :user THEN m.toUser " +
            "ELSE m.fromUser END " +
            "FROM ChatMessage m " +
            "WHERE m.fromUser = :user OR m.toUser = :user")
    List<String> findAllOtherUsers(@Param("user") String user);
}
