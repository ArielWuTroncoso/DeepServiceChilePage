package cl.deepservice.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Reenvía las rutas del SPA al index.html para que React Router
 * pueda resolverlas cuando el usuario entra directo por URL.
 * Solo aplica en el despliegue de un único servicio (Dockerfile combinado).
 */
@Controller
public class SpaController {

    @GetMapping({
            "/", "/productos", "/productos/**", "/servicios",
            "/marcas", "/nosotros", "/contacto",
            "/login", "/registro", "/admin"
    })
    public String index() {
        return "forward:/index.html";
    }
}
