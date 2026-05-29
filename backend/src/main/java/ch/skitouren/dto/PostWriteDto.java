package ch.skitouren.dto;

import jakarta.validation.constraints.NotBlank;

public record PostWriteDto(
        @NotBlank String title,
        String summary,
        @NotBlank String content
) {}
