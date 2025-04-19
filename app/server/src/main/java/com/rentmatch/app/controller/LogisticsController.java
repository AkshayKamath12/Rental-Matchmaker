package com.rentmatch.app.controller;

import com.rentmatch.app.dao.ProfileRepository;
import com.rentmatch.app.dao.SubmittedUserRepository;
import com.rentmatch.app.dao.UserRepository;
import com.rentmatch.app.entity.Profile;
import com.rentmatch.app.entity.SubmittedUser;
import com.rentmatch.app.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

    private User getLoggedUserDetails(String loggedUser) {
        Optional<User> optionalUser = userRepository.findByUsernameOrEmail(loggedUser, loggedUser);
        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else {
            return null;
        }
    }

    private Profile getLoggedProfile(String loggedUser) {
        Optional<Profile> profile = profileRepository.findByUsername(loggedUser);
        if (profile.isPresent()) {
            return profile.get();
        } else {
            return null;
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<String> submit() {
        String loggedUser = getLoggedUser();
        if (loggedUser != null) {
            User user = getLoggedUserDetails(loggedUser);
            if (user != null) {
                String username = user.getUsername();
                String email = user.getEmail();
                if (!submittedUserRepository.existsByUsername(username) && ! submittedUserRepository.existsByUsername(email)) {
                    submittedUserRepository.save(new SubmittedUser(email));
                    return ResponseEntity.ok("Submitted");
                }
                return ResponseEntity.ok("User already submitted");
            }
            return new ResponseEntity<>("error occured in server",HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("couldn't find logged in user",HttpStatus.FORBIDDEN);
    }

    @PostMapping("/profile")
    public ResponseEntity<String> profile(@RequestBody Profile profile) {
        String loggedUser = getLoggedUser();
        if (loggedUser != null) {
            User user = getLoggedUserDetails(loggedUser);
            if (user != null) {
                String email = user.getEmail();
                Profile profileFound = getLoggedProfile(email);
                if(profileFound != null){
                    profileFound.setLongitude(profile.getLongitude());
                    profileFound.setLatitude(profile.getLatitude());
                    profileRepository.save(profileFound);
                    return ResponseEntity.ok("Profile updated");
                } else {
                    profileRepository.save(new Profile(email, profile.getLongitude(), profile.getLatitude()));
                    return ResponseEntity.ok("Profile created");
                }
            }
            return new ResponseEntity<>("error occured in server",HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("couldn't find logged in user",HttpStatus.FORBIDDEN);
    }

    @GetMapping("/profile")
    public Profile getProfile() {
        String username = getLoggedUser();
        if (username != null) {
            return getLoggedProfile(username);
        }else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found");
        }
    }

    @GetMapping("/username")
    public String getUsername() {
        String userCred = getLoggedUser();
        if (userCred != null) {
            User user = getLoggedUserDetails(userCred);
            return user.getUsername();
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found");
    }
}