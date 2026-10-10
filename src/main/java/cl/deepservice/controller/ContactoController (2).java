package cl.deepservice.controller;

import cl.deepservice.dto.Dtos.ContactoRequest;
import cl.deepservice.dto.Dtos.ContactoResponse;
import cl.deepservice.service.ContactoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacto")
public class ContactoController {

    private final ContactoService contacto;

    public ContactoController(ContactoService contacto) {
        this.contacto = contacto;
    }

    /** Publico: formulario del sitio. */
    @PostMapping
    public ResponseEntity<ContactoResponse> crear(@Valid @RequestBody ContactoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contacto.registrar(req));
    }

    /** Interno: bandeja del panel de administracion. */
    @GetMapping
    public List<ContactoResponse> listar() {
        return contacto.listar();
    }

    @PutMapping("/{id}/atender")
    public ContactoResponse atender(@PathVariable Long id) {
        return contacto.atender(id);
    }
}
