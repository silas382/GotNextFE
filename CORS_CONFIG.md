# CORS Configuration for Backend

The frontend is being blocked by CORS when trying to call the backend API. You need to configure CORS in your Spring Boot backend.

## Option 1: Add CORS Configuration Class

Create a new file in your backend: `config/CorsConfig.java`

```java
package GotNext.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow all origins (for development)
        // In production, replace with specific frontend URL
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*"); // or use config.addAllowedOrigin("http://localhost:8084")
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

## Option 2: Add @CrossOrigin to Controller

Alternatively, add `@CrossOrigin` annotation to your `PlayerQueueController`:

```java
@RestController
@RequestMapping("/api/queue")
@CrossOrigin(origins = "*") // or use specific origin: origins = "http://localhost:8084"
public class PlayerQueueController {
    // ... your existing code
}
```

## Option 3: Global CORS Configuration (Recommended for Development)

Add this to your main application class or a configuration class:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("*") // or "http://localhost:8084" for specific origin
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}
```

## After Adding CORS Configuration:

1. Restart your Spring Boot backend server
2. Try adding a player again from the frontend
3. The API calls should now work, and `backendId` will be stored
4. Deleting players should then work correctly

## For Production:

Replace `allowedOrigins("*")` with your actual frontend domain:
- `allowedOrigins("https://yourdomain.com")`

