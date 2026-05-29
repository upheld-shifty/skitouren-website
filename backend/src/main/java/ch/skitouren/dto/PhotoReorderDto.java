package ch.skitouren.dto;

import jakarta.validation.constraints.NotNull;

public record PhotoReorderDto(@NotNull Long id, int sortOrder) {}
