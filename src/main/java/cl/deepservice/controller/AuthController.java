package cl.deepservice.controller;

import cl.deepservice.dto.Dtos.*;
import cl.deepservice.security.JwtService;
import cl.deepservice.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UsuarioService usuarioService;

    public AuthController(AuthenticationManager authManager, JwtService jwtService, UsuarioService usuarioService) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/auth/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.correo(), req.contrasena()));
        UsuarioResponse usuario = usuarioService.porCorreo(req.correo());
        String token = jwtService.generar(usuario.correo(), Map.of("nombre", usuario.nombre()));
        return new LoginResponse(token, usuario);
    }

    @GetMapping("/auth/me")
    public UsuarioResponse yo(Authentication auth) {
        return usuarioService.porCorreo(auth.getName());
    }

    @PostMapping("/usuarios")
    public ResponseEntity<UsuarioResponse> registrar(@Valid @RequestBody RegistroRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.registrar(req));
    }
}
