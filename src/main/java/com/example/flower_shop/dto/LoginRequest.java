package com.example.flower_shop.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class LoginRequest{
    @NotBlank(message = "Email nuk guxon të jetë i zbrazët!")
    @Email(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}$", message = "Ju lutem shkruani një email të vlefshëm!")
    private String email;

    @NotBlank(message = "Fjalëkalimi nuk guxon të jetë i zbrazët!")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).{8,}$", message = "Fjalëkalimi duhet të ketë të paktën 8 karaktere, një shkronjë të madhe dhe një numër!")
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}