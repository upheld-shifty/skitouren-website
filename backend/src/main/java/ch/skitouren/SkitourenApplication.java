package ch.skitouren;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class SkitourenApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkitourenApplication.class, args);
    }
}
