package ch.skitouren.controller;

import ch.skitouren.config.AppProperties;
import ch.skitouren.domain.AppUser;
import ch.skitouren.dto.AuthRequest;
import ch.skitouren.dto.AuthResponse;
import ch.skitouren.dto.RegisterRequest;
import ch.skitouren.repository.AppUserRepository;
import ch.skitouren.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppProperties     props;
    private final PasswordEncoder   passwordEncoder;
    private final JwtUtil           jwtUtil;
    private final AppUserRepository userRepo;

    public AuthController(AppProperties props,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil,
                          AppUserRepository userRepo) {
        this.props           = props;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil         = jwtUtil;
        this.userRepo        = userRepo;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest req) {
        // 1. Env-var admin has priority (always available, independent of the DB)
        if (props.auth().username().equals(req.username()) &&
            passwordEncoder.matches(req.password(), props.auth().passwordHash())) {
            String token = jwtUtil.generate(req.username(), "ADMIN");
            return new AuthResponse(token, jwtUtil.extractExpiry(token), "ADMIN");
        }

        // 2. Database users
        AppUser user = userRepo.findByUsername(req.username())
                .filter(u -> passwordEncoder.matches(req.password(), u.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        String role  = user.getRole().name();
        String token = jwtUtil.generate(user.getUsername(), role);
        return new AuthResponse(token, jwtUtil.extractExpiry(token), role);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        // Prevent collision with the env-var admin account
        if (props.auth().username().equalsIgnoreCase(req.username()) ||
            userRepo.existsByUsername(req.username())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Benutzername bereits vergeben");
        }

        AppUser user = new AppUser(req.username(), passwordEncoder.encode(req.password()));
        userRepo.save(user);

        String role  = user.getRole().name(); // USER by default
        String token = jwtUtil.generate(user.getUsername(), role);
        return new AuthResponse(token, jwtUtil.extractExpiry(token), role);
    }
}
