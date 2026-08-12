package com.shopsphere.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;


    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {

        return configuration.getAuthenticationManager();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // Use the existing CorsConfig.java configuration
                .cors(Customizer.withDefaults())

                // Disable CSRF because JWT authentication is used
                .csrf(csrf -> csrf.disable())

                // JWT authentication is stateless
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Authorization rules
                .authorizeHttpRequests(auth -> auth

                        // ==========================================
                        // PUBLIC AUTHENTICATION APIs
                        // ==========================================
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()


                        // ==========================================
                        // PUBLIC AI SHOPPING ASSISTANT
                        // ==========================================
                        .requestMatchers(
                                "/api/ai/**"
                        ).permitAll()


                        // ==========================================
                        // PUBLIC PRODUCT APIs
                        // ==========================================
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/**"
                        ).permitAll()


                        // ==========================================
                        // PUBLIC CATEGORY APIs
                        // ==========================================
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/categories/**"
                        ).permitAll()


                        // ==========================================
                        // PUBLIC PRODUCT REVIEW APIs
                        // ==========================================
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/reviews/product/**"
                        ).permitAll()


                        // ==========================================
                        // EVERYTHING ELSE REQUIRES JWT
                        // ==========================================
                        .anyRequest()
                        .authenticated()
                )

                // Add JWT filter before Spring Security's
                // UsernamePasswordAuthenticationFilter
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}