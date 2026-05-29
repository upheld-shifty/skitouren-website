package ch.skitouren.security;

import ch.skitouren.config.AppProperties;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey secretKey;
    private final long      expiryMs;

    public JwtUtil(AppProperties props) {
        this.secretKey = Keys.hmacShaKeyFor(
                props.auth().jwtSecret().getBytes(StandardCharsets.UTF_8));
        this.expiryMs  = (long) props.auth().jwtExpiryHours() * 3600 * 1000;
    }

    public String generate(String subject, String role) {
        Date now    = new Date();
        Date expiry = new Date(now.getTime() + expiryMs);
        return Jwts.builder()
                .subject(subject)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey)
                .compact();
    }

    /** Backward-compatible: generates an ADMIN token (env-var admin). */
    public String generate(String subject) {
        return generate(subject, "ADMIN");
    }

    public String extractSubject(String token) {
        return claims(token).getSubject();
    }

    public String extractRole(String token) {
        String role = claims(token).get("role", String.class);
        return role != null ? role : "ADMIN"; // legacy tokens without role claim → ADMIN
    }

    public Instant extractExpiry(String token) {
        return claims(token).getExpiration().toInstant();
    }

    public boolean isValid(String token) {
        try {
            extractSubject(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private io.jsonwebtoken.Claims claims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
