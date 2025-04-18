package com.rentmatch.app.controller;

import com.rentmatch.app.dao.UserRepository;
import com.rentmatch.app.entity.User;
import com.rentmatch.app.matchesResponse.Response;
import com.rentmatch.app.service.MatchesService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/api")
public class MatchesController {
    private MatchesService matchesService;
    private UserRepository userRepository;

    public MatchesController(MatchesService matchesService, UserRepository userRepository) {
        this.matchesService = matchesService;
        this.userRepository = userRepository;
    }

    private User getLoggedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            String name = auth.getName();
            Optional<User> user = userRepository.findByUsernameOrEmail(name, name);
            if (user.isPresent()) {
                return user.get();
            }
        }
        return null;
    }

    @GetMapping("/matches")
    public ResponseEntity<Response> matches() {
        User user = getLoggedUser();
        Hashtable<User, Double> result= matchesService.findMatches(user);
        List<String> array1 = new ArrayList<>();
        List<Double> array2 = new ArrayList<>();

        Enumeration<User> e = result.keys();
        while(e.hasMoreElements()) {
            User u = e.nextElement();
            array1.add(u.getUsername());
            array2.add(result.get(u));
        }


        Response response = new Response(array1, array2);
        return ResponseEntity.ok(response);
    }
}
