package com.rentmatch.app.controller;

import com.rentmatch.app.dao.UserRepository;
import com.rentmatch.app.DTO.MatchDTO;
import com.rentmatch.app.entity.User;
import com.rentmatch.app.service.MatchesService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/matches/{range}")
    public List<MatchDTO> matches(@PathVariable int range) {
        User user = getLoggedUser();Hashtable<User, Double> result= matchesService.findMatches(user, range);
        List<MatchDTO> matchArray = new ArrayList<>();
        Enumeration<User> e = result.keys();
        while(e.hasMoreElements()) {
            User u = e.nextElement();
            matchArray.add(new MatchDTO(u.getUsername(), result.get(u)));
        }
        matchArray.sort(Comparator.comparingDouble(MatchDTO::getScore).reversed());
        return matchArray;
    }
}
