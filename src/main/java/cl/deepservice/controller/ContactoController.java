package cl.deepservice.controller;

import cl.deepservice.dto.Dtos.ContactoRequest;
import cl.deepservice.dto.Dtos.ContactoResponse;
import cl.deepservice.security.IpCliente;
import cl.deepservice.security.PoliticaLimites;
import cl.deepservice.service.ContactoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Formulario público del sitio. Es lo único de contacto que no exige sesión, y solo permite
 * ENVIAR: leer o gestionar las solicitudes es del panel (/api/admin/solicitudes).
 */
@RestController
@RequestMapping("/api/contacto")
public class ContactoController {

    private final ContactoService contacto;
    private final PoliticaLimites limites;

    public ContactoController(ContactoService contacto, PoliticaLimites limites) {
        this.contacto = contacto;
        this.limites = limites;
    }

    @PostMapping
    public ResponseEntity<Void> crear(@Valid @RequestBody ContactoRequest req, HttpServletRequest http) {
        limites.envioDeContacto(IpCliente.de(http));
        contacto.registrar(req);
        // No se devuelve lo guardado: el formulario público no necesita ver nada de vuelta.
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
