package com.example.flower_shop;

import com.example.flower_shop.model.Role;
import com.example.flower_shop.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication(scanBasePackages = "com.example.flower_shop")
public class FlowerShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlowerShopApplication.class, args);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CommandLineRunner rregulloRoletFillestare(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByEmertimi("USER").isEmpty()) {
                Role userRole = new Role();
                userRole.setEmertimi("USER");
                userRole.setPershkrimi("Klient i thjeshte");
                userRole.setNormalizedName("USER");
                roleRepository.save(userRole);
            }

            if (roleRepository.findByEmertimi("ADMIN").isEmpty()) {
                Role adminRole = new Role();
                adminRole.setEmertimi("ADMIN");
                adminRole.setPershkrimi("Administrator i sistemit");
                adminRole.setNormalizedName("ADMIN");
                roleRepository.save(adminRole);
            }
            
            System.out.println(">> Rolet USER dhe ADMIN u kontrolluan/shtuan me sukses!");
        };
    }
}