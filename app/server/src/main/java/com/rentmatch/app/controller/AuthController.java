package com.rentmatch.app.controller;

import com.rentmatch.app.DTO.SignupDTO;
import com.rentmatch.app.dao.RoleRepository;
import com.rentmatch.app.dao.UserRepository;
import com.rentmatch.app.entity.Role;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.rentmatch.app.entity.User;
import java.util.Collection;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignupDTO signupDTO) {


        if(userRepository.findByUsernameOrEmail(signupDTO.getUsername(), signupDTO.getEmail()).isPresent()) {
            return new ResponseEntity<>("Username or email already exists", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setName(signupDTO.getName());
        user.setUsername(signupDTO.getUsername());
        user.setPassword(passwordEncoder.encode(signupDTO.getPassword()));
        user.setEmail(signupDTO.getEmail());

        Role roles = roleRepository.findByName("ROLE_ADMIN").get();
        user.setRoles(Collections.singleton(roles));
        userRepository.save(user);



        return new ResponseEntity<>("user created", HttpStatus.OK);

    }
}
