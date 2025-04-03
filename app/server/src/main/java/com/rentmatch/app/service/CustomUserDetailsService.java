package com.rentmatch.app.service;

import com.rentmatch.app.entity.User;
import com.rentmatch.app.dao.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private UserRepository userRepository;
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);
        if (user.isPresent()) {
            User userDetails = user.get();
            Set<GrantedAuthority> authorities = userDetails
                    .getRoles()
                    .stream()
                    .map((role) -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toSet());
            return new org.springframework.security.core.userdetails.User(
                    userDetails.getEmail(),
                    userDetails.getPassword(),
                    authorities
            );
        }else{
            throw new UsernameNotFoundException("Invalid username or email");
        }

    }
}
