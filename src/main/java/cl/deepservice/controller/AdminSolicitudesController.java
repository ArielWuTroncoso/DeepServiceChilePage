package cl.deepservice.controller;

import cl.deepservice.dto.Dtos.ContactoResponse;
import cl.deepservice.service.ContactoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Bandeja de solicitudes de clientes. Solo ADMIN (ver SecurityConfig: /api/admin/**). */
@RestController
@RequestMapping("/api/admin/solicitudes")
public class AdminSolicitudesController {

    private final ContactoService contacto;

    public AdminSolicitudesController(ContactoService contacto) {
        this.contacto = contacto;
    }

    @GetMapping
    public List<ContactoResponse> listar() {
        return contacto.listar();
    }

    @PutMapping("/{id}/atender")
    public ContactoResponse atender(@PathVariable Long id) {
        return contacto.atender(id);
    }

    @PutMapping("/{id}/reabrir")
    public ContactoResponse reabrir(@PathVariable Long id) {
        return contacto.reabrir(id);
    }
}
