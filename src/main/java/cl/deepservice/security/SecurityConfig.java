package cl.deepservice.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    /** Rutas del SPA que Spring debe servir como index.html. */
    public static final String[] RUTAS_SPA = {
            "/", "/index.html", "/productos", "/productos/**", "/servicios",
            "/marcas", "/nosotros", "/contacto", "/login", "/registro", "/admin",
            "/assets/**", "/favicon.svg", "/favicon.ico", "/error"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationManager authenticationManager,
            JwtAuthFilter jwtAuthFilter,
            CorsConfigurationSource corsConfigurationSource) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable())
            .authenticationManager(authenticationManager)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint((req, res, e) ->
                            escribirError(res, HttpStatus.UNAUTHORIZED, "Debes iniciar sesion para acceder a este recurso"))
                    .accessDeniedHandler((req, res, e) ->
                            escribirError(res, HttpStatus.FORBIDDEN, "No tienes permisos para realizar esta accion")))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers(RUTAS_SPA).permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/salud").permitAll()
                    // Catalogo publico
                    .requestMatchers(HttpMethod.GET, "/api/categorias", "/api/marcas",
                                     "/api/productos", "/api/productos/**").permitAll()
                    // Formulario de contacto
                    .requestMatchers(HttpMethod.POST, "/api/contacto").permitAll()
                    // Registro e inicio de sesion
                    .requestMatchers(HttpMethod.POST, "/usuarios", "/auth/login").permitAll()
                    .requestMatchers(HttpMethod.GET, "/auth/me").authenticated()
                    // Gestion interna
                    .requestMatchers(HttpMethod.GET, "/api/contacto").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/contacto/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.POST, "/api/productos").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMIN")
                    .anyRequest().authenticated());

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(UsuarioDetailsService detalles, PasswordEncoder encoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(detalles);
        provider.setPasswordEncoder(encoder);
        return new ProviderManager(provider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origins:http://localhost:5173}") String origenes) {

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.stream(origenes.split(","))
                .map(String::trim).filter(v -> !v.isBlank()).toList());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    private void escribirError(jakarta.servlet.http.HttpServletResponse res, HttpStatus status, String mensaje)
            throws java.io.IOException {
        res.setStatus(status.value());
        res.setCharacterEncoding("UTF-8");
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        res.getWriter().write("{\"fecha\":\"" + OffsetDateTime.now()
                + "\",\"status\":" + status.value() + ",\"mensaje\":\"" + mensaje + "\"}");
    }
}
