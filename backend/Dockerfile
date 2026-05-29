# ── dev stage: full JDK + Maven, source mounted via compose volume ──────────
FROM maven:3.9-eclipse-temurin-21 AS dev
WORKDIR /app

# Pre-warm Maven dependency cache — cached layer unless pom.xml changes
COPY pom.xml .
RUN mvn dependency:go-offline -q

COPY src ./src
EXPOSE 8080

# ── build stage: compile fat JAR ─────────────────────────────────────────────
FROM dev AS build
RUN mvn package -DskipTests -q

# ── prod stage: minimal JRE, no build tools ───────────────────────────────────
FROM eclipse-temurin:21-jre AS prod
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
