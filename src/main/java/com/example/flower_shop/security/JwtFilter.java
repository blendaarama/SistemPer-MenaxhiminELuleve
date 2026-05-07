package com.example.flower_shop.security;

import com.example.flower_shop.service.JwtService;
import com.example.flower_shop.service.UserService;
import com.example.flower_shop.service.UserClaimsService;
import com.example.flower_shop.model.User;
import com.example.flower_shop.model.UserClaims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;
    private final UserClaimsService userClaimsService;

    public JwtFilter(JwtService jwtService, UserService userService, UserClaimsService userClaimsService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.userClaimsService = userClaimsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

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
        }
        filterChain.doFilter(request, response);
    }
}