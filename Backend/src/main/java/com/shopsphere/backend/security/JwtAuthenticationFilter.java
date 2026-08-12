package com.shopsphere.backend.security;

import com.shopsphere.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;


    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request
    ) throws ServletException {

        String requestURI = request.getRequestURI();

        // AI Shopping Assistant does not require JWT authentication
        if (requestURI.startsWith("/api/ai/")) {
            return true;
        }

        return false;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader =
                request.getHeader("Authorization");

        String jwt = null;
        String email = null;


        // ==========================================
        // CHECK BEARER TOKEN
        // ==========================================

        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            jwt = authHeader.substring(7);

            try {

                email = jwtUtil.extractEmail(jwt);

            } catch (Exception exception) {

                System.out.println(
                        "JWT extraction failed: "
                                + exception.getMessage()
                );
            }
        }


        // ==========================================
        // AUTHENTICATE USER
        // ==========================================

        if (email != null &&
                SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

            try {

                UserDetails userDetails =
                        userDetailsService
                                .loadUserByUsername(email);


                if (jwtUtil.validateToken(
                        jwt,
                        userDetails.getUsername()
                )) {

                    UsernamePasswordAuthenticationToken
                            authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );


                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );


                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );
                }

            } catch (Exception exception) {

                System.out.println(
                        "JWT authentication failed: "
                                + exception.getMessage()
                );
            }
        }


        // ==========================================
        // CONTINUE REQUEST
        // ==========================================

        filterChain.doFilter(
                request,
                response
        );
    }
}