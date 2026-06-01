package com.example.flower_shop.controller;

import com.example.flower_shop.model.User;
import com.example.flower_shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // GET ALL USERS
    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }

    // CREATE USER
    @PostMapping
    public User create(@RequestBody User user) {

        // ENCODE PASSWORD
        user.setPassword(
            passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    // UPDATE USER
    @PutMapping("/{id}")
    public User update(
            @PathVariable Integer id,
            @RequestBody User updated
    ) {

        User user = userRepository.findById(id)
                .orElseThrow();

        user.setEmri(updated.getEmri());
        user.setMbiemri(updated.getMbiemri());
        user.setEmail(updated.getEmail());

        // vetëm nëse ndryshohet passwordi
        if (updated.getPassword() != null &&
            !updated.getPassword().isEmpty()) {

            user.setPassword(
                passwordEncoder.encode(updated.getPassword())
            );
        }

        user.setRole(updated.getRole());

        return userRepository.save(user);
    }

    // DELETE USER
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        userRepository.deleteById(id);
    }
}