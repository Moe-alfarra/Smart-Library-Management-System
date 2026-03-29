package com.moeAlfarra.Smart_Library_Management_System.controller;

import com.moeAlfarra.Smart_Library_Management_System.dto.LoginRequest;
import com.moeAlfarra.Smart_Library_Management_System.dto.RegisterRequest;
import com.moeAlfarra.Smart_Library_Management_System.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/ping")
    public String ping() {
        long start = System.currentTimeMillis();
        String result = "ok";
        long end = System.currentTimeMillis();
        System.out.println("PING ENDPOINT TIME: " + (end - start) + " ms");
        return result;
    }



    // Member Register
    @PostMapping("/member/register")
    public ResponseEntity<String> registerMember(@RequestBody RegisterRequest request) {
        authService.registerMember(request.getName(), request.getEmail(), request.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED).body("Member registered successfully");
    }


    // Admin Register
    @PostMapping("/admin/create")
    public ResponseEntity<String> createAdmin(@RequestBody RegisterRequest request) {
        // You should protect this endpoint in Spring Security for admins only
        authService.createAdmin(request.getName(), request.getEmail(), request.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED).body("Admin created successfully");
    }

    // Login for Admin & Member
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {

        String token = authService.login(request.getEmail(), request.getPassword());

        return ResponseEntity.ok(Map.of(
                "accessToken", token,
                "tokenType", "Bearer"
        ));
    }
}