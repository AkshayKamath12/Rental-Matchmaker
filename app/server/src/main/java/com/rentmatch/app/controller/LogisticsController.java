package com.rentmatch.app.controller;

import com.rentmatch.app.dao.ProfileRepository;
import com.rentmatch.app.dao.SubmittedUserRepository;
import com.rentmatch.app.dao.UserRepository;
import com.rentmatch.app.entity.Profile;
import com.rentmatch.app.entity.SubmittedUser;
import com.rentmatch.app.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api")
public class LogisticsController {
    ProfileRepository profileRepository;
    SubmittedUserRepository submittedUserRepository;
    UserRepository userRepository;

    public LogisticsController(ProfileRepository profileRepository, SubmittedUserRepository submittedUserRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.submittedUserRepository = submittedUserRepository;
        this.userRepository = userRepository;
    }

    private String getLoggedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            return auth.getName();
        }
        return null;
    }
    @PostMapping("/submit")
    public void submit() {
        String loggedUser = getLoggedUser();
        if (loggedUser != null) {
            Optional<User> optionalUser = userRepository.findByUsernameOrEmail(loggedUser, loggedUser);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                String username = user.getUsername();
                String email = user.getEmail();
                if (!submittedUserRepository.existsByUsername(username) && ! submittedUserRepository.existsByUsername(email)) {
                    submittedUserRepository.save(new SubmittedUser(email));
                }
            }

        }
    }
}
