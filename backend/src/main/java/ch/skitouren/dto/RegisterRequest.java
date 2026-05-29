package ch.skitouren.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank
        @Size(min = 3, max = 30, message = "Benutzername muss 3–30 Zeichen lang sein")
        @Pattern(regexp = "^[a-zA-Z0-9_-]+$",
                 message = "Benutzername darf nur Buchstaben, Ziffern, - und _ enthalten")
        String username,

        @NotBlank
        @Size(min = 8, message = "Passwort muss mindestens 8 Zeichen lang sein")
        String password

) {}
