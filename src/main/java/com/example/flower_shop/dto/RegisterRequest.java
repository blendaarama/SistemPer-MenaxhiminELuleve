package com.example.flower_shop.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class RegisterRequest {

    @NotBlank(message = "Emri nuk guxon te jete i zbrazet!")
    private String name;

    @NotBlank(message = "Email nuk guxon te jete i zbrazet!")
    @Email(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}$", message = "Ju lutem shkruani nje email te vlefshem!")
    private String email;

    @NotBlank(message = "Fjalekalimi nuk guxon te jete i zbrazet!")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).{8,}$", message = "Fjalekalimi duhet te kete te pakten 8 karaktere, nje shkronje te madhe dhe nje numer!")
    private String password;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}