package com.example.firstWebApp.services;

import com.example.firstWebApp.entities.User;
import com.example.firstWebApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private static final String ADMIN_EMAIL = "admin@gmail.com";
    private static final String ADMIN_PASSWORD = "1234";

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        // Check if admin
        if (ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password)) {
            User admin = new User();
            admin.setId(-1L);
            admin.setFullName("Admin");
            admin.setEmail(ADMIN_EMAIL);
            admin.setPhoneNumber("0000000000");
            admin.setAddress("Admin Address");
            admin.setPassword(ADMIN_PASSWORD);
            return admin;
        }

        // Regular user login
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }
        throw new RuntimeException("Invalid email or password!");
    }

    public User updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        user.setPassword(newPassword);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}