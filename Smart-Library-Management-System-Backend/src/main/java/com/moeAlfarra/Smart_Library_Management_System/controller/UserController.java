package com.moeAlfarra.Smart_Library_Management_System.controller;

import com.moeAlfarra.Smart_Library_Management_System.entity.User;
import com.moeAlfarra.Smart_Library_Management_System.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService)  {
        this.userService = userService;
    }

    // Used by Auth to create user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping("/id/{id}")
    @PreAuthorize("hasRole('ADMIN') or principal.id == #id")
    // Admins can view any user, members can only view themselves
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can search by email
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Only admins can list all users
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')") // Only admins can delete users
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
