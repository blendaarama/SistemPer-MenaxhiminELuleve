package com.example.flower_shop.security;

import com.example.flower_shop.service.JwtService;
<<<<<<< HEAD
import com.example.flower_shop.service.UserService;
import com.example.flower_shop.service.UserClaimsService;
import com.example.flower_shop.model.User;
import com.example.flower_shop.model.UserClaims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
=======
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
>>>>>>> ef5f694 (duke e rregullu jwt)
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
<<<<<<< HEAD
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
=======
import java.util.Collections;
>>>>>>> ef5f694 (duke e rregullu jwt)

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
<<<<<<< HEAD
    private final UserService userService;
    private final UserClaimsService userClaimsService;

    public JwtFilter(JwtService jwtService, UserService userService, UserClaimsService userClaimsService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.userClaimsService = userClaimsService;
    }
=======
>>>>>>> ef5f694 (duke e rregullu jwt)

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

<<<<<<< HEAD
        final String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
=======
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
>>>>>>> ef5f694 (duke e rregullu jwt)
            filterChain.doFilter(request, response);
            return;
        }

<<<<<<< HEAD
        String token = header.substring(7);
        String username = jwtService.extractUsername(token);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            User user = userService.getUserByEmail(username);

            if (jwtService.validateToken(token)) {
                List<UserClaims> claims = userClaimsService.getClaimsByUserId(user.getId());

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        user.getRoles().stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getEmertimi()))
                            .collect(Collectors.toList())
                );

                Map<String, Object> claimsMap = new HashMap<>();
                for (UserClaims claim : claims) {
                    claimsMap.put(claim.getClaimType(), claim.getClaimValue());
                }

                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
=======
        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        if (username != null &&
            SecurityContextHolder.getContext().getAuthentication() == null &&
            jwtService.validateToken(token)) {

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            Collections.emptyList()
                    );

            auth.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );

            SecurityContextHolder.getContext().setAuthentication(auth);
>>>>>>> ef5f694 (duke e rregullu jwt)
        }
        filterChain.doFilter(request, response);
    }
}