package com.msis.app.spring.security;

import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationInMs}")
    private int jwtExpirationInMs;

    /**
     * Generates JwtToken from the provided authentication information.
     * @param authentication the authentication with user information (username and password)
     * @return a JwtToken
     */
    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .claim("username", userPrincipal.getUsername())
                .claim("name", userPrincipal.getName())
                .claim("role", userPrincipal.getAuthorities().iterator().next().getAuthority())
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    /**
     * Get the id of a user from the provided token.
     * @param token the encoded token that contains user information
     * @return the decoded id
     */
    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    /**
     * Validates a JwtToken.
     * @param authToken the token that needs validating
     * @return true if the token is valid or false otherwise
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            log.error("Invalid JWT signature.");
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token.");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token.");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token.");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty.");
        }
        return false;
    }
}