package com.rentmatch.app.dao;

import com.rentmatch.app.entity.SubmittedUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmittedUserRepository extends JpaRepository<SubmittedUser, Integer> {
    Boolean existsByUsername(String username);
}
