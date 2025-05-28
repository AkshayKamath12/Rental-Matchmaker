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

import java.security.Principal;
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
    public ResponseEntity<String> submit(Principal principal) {
        String loggedUser = principal.getName();
        if (loggedUser != null) {
            User user = getLoggedUserDetails(loggedUser);
            if (user != null) {
                String username = user.getUsername();
                String email = user.getEmail();
                if (!submittedUserRepository.existsByUsername(username) && ! submittedUserRepository.existsByUsername(email)) {
                    submittedUserRepository.save(new SubmittedUser(username));
                    return ResponseEntity.ok("Submitted");
                }
                return ResponseEntity.ok("User already submitted");
            }
            return new ResponseEntity<>("error occured in server",HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("couldn't find logged in user",HttpStatus.FORBIDDEN);
    }

    @PostMapping("/profile")
    public ResponseEntity<String> profile(@RequestBody Profile profile, Principal principal) {
        String username = principal.getName();
        if (username != null) {
            Profile profileFound = getLoggedProfile(username);
            if(profileFound != null){
                profileFound.setLongitude(profile.getLongitude());
                profileFound.setLatitude(profile.getLatitude());
                profileRepository.save(profileFound);
                return ResponseEntity.ok("Profile updated");
            } else {
                profileRepository.save(new Profile(username, profile.getLongitude(), profile.getLatitude()));
                return ResponseEntity.ok("Profile created");
            }
        }
        return new ResponseEntity<>("couldn't find logged in user",HttpStatus.FORBIDDEN);
    }

    @GetMapping("/profile")
    public Profile getProfile(Principal principal) {
        String username = principal.getName();
        if (username != null) {
            return getLoggedProfile(username);
        }else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found");
        }
    }

    @GetMapping("/username")
    public String getUsername(Principal principal) {
        String username = principal.getName();
        if (username != null) {
            return username;
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found");
    }
}