package com.moeAlfarra.Smart_Library_Management_System.service;

import com.moeAlfarra.Smart_Library_Management_System.config.JwtUtil;
import com.moeAlfarra.Smart_Library_Management_System.entity.Role;
import com.moeAlfarra.Smart_Library_Management_System.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class AuthService {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserService userService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // Member Create
    public void registerMember(String name, String email, String password) {
        User member = new User(name, email, password, Role.MEMBER);
        userService.createUser(member);
    }

    // Admin Create
    public void createAdmin(String name, String email, String password) {
        User admin = new User(name, email, password, Role.ADMIN);
        userService.createUser(admin); // password hashed in UserService
    }

    // Login for Admin & Member
    public String login(String email, String password) {

        User user = userService.getUserByEmailSafe(email);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
    }
}