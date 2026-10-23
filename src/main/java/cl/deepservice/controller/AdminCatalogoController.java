package cl.deepservice.controller;

import cl.deepservice.dto.Dtos.ActivoRequest;
import cl.deepservice.dto.Dtos.ProductoAdmin;
import cl.deepservice.dto.Dtos.ProductoRequest;
import cl.deepservice.service.CatalogoAdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Gestión de equipos del catálogo. Solo ADMIN (ver SecurityConfig: /api/admin/**). */
@RestController
@RequestMapping("/api/admin/productos")
public class AdminCatalogoController {

    private final CatalogoAdminService catalogo;

    public AdminCatalogoController(CatalogoAdminService catalogo) {
        this.catalogo = catalogo;
    }

    @GetMapping
    public List<ProductoAdmin> listar() {
        return catalogo.listar();
    }

    @PostMapping
    public ResponseEntity<ProductoAdmin> crear(@Valid @RequestBody ProductoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogo.crear(req));
    }

    @PutMapping("/{id}")
    public ProductoAdmin actualizar(@PathVariable Long id, @Valid @RequestBody ProductoRequest req) {
        return catalogo.actualizar(id, req);
    }

    @PutMapping("/{id}/activo")
    public ProductoAdmin cambiarActivo(@PathVariable Long id, @Valid @RequestBody ActivoRequest req) {
        return catalogo.cambiarActivo(id, req.activo());
    }
}
