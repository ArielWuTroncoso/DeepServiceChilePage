package cl.deepservice.controller;

import cl.deepservice.dto.Dtos.*;
import cl.deepservice.security.IpCliente;
import cl.deepservice.security.JwtService;
import cl.deepservice.security.PoliticaLimites;
import cl.deepservice.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UsuarioService usuarioService;
    private final PoliticaLimites limites;

    public AuthController(AuthenticationManager authManager, JwtService jwtService,
                          UsuarioService usuarioService, PoliticaLimites limites) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.usuarioService = usuarioService;
        this.limites = limites;
    }

    @PostMapping("/auth/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req, HttpServletRequest http) {
        String ip = IpCliente.de(http);
        limites.antesDeLogin(ip, req.correo());
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(req.correo(), req.contrasena()));
        } catch (AuthenticationException ex) {
            limites.loginFallido(ip, req.correo());
            throw ex;
        }
        limites.loginCorrecto(ip, req.correo());
        UsuarioResponse usuario = usuarioService.porCorreo(req.correo());
        String token = jwtService.generar(usuario.correo(), Map.of("nombre", usuario.nombre()));
        return new LoginResponse(token, usuario);
    }

    @GetMapping("/auth/me")
    public UsuarioResponse yo(Authentication auth) {
        return usuarioService.porCorreo(auth.getName());
    }

    /** Registro de administradores: crea la cuenta y deja la sesion iniciada. */
    @PostMapping("/auth/admin/registro")
    public ResponseEntity<LoginResponse> registrarAdmin(@Valid @RequestBody RegistroAdminRequest req,
                                                        HttpServletRequest http) {
        limites.intentoDeRegistro(IpCliente.de(http));
        UsuarioResponse usuario = usuarioService.registrarAdmin(req);
        String token = jwtService.generar(usuario.correo(), Map.of("nombre", usuario.nombre()));
        return ResponseEntity.status(HttpStatus.CREATED).body(new LoginResponse(token, usuario));
    }

    /** La persona cerro la ventana de bienvenida de su perfil: no se vuelve a mostrar. */
    @PostMapping("/auth/me/bienvenida")
    public UsuarioResponse bienvenidaVista(Authentication auth) {
        return usuarioService.marcarBienvenidaVista(auth.getName());
    }

    /**
     * Cambio de contraseña. Cierra las demás sesiones de la cuenta y entrega una sesión nueva
     * a quien lo hizo, para que no tenga que volver a ingresar.
     */
    @PutMapping("/auth/me/contrasena")
    public LoginResponse cambiarContrasena(@Valid @RequestBody CambioClaveRequest req, Authentication auth) {
        limites.antesDeCambiarClave(auth.getName());
        UsuarioResponse usuario;
        try {
            usuario = usuarioService.cambiarContrasena(auth.getName(), req);
        } catch (RuntimeException ex) {
            limites.cambioDeClaveFallido(auth.getName());
            throw ex;
        }
        limites.cambioDeClaveCorrecto(auth.getName());
        String token = jwtService.generar(usuario.correo(), Map.of("nombre", usuario.nombre()));
        return new LoginResponse(token, usuario);
    }
}
