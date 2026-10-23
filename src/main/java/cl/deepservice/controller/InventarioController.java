package cl.deepservice.controller;

import cl.deepservice.dto.Dtos.InventarioItem;
import cl.deepservice.dto.Dtos.MinimoRequest;
import cl.deepservice.dto.Dtos.MovimientoRequest;
import cl.deepservice.dto.Dtos.MovimientoResponse;
import cl.deepservice.service.InventarioService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Inventario de stock. Solo ADMIN (ver SecurityConfig: /api/admin/**). */
@RestController
@RequestMapping("/api/admin/inventario")
public class InventarioController {

    private final InventarioService inventario;

    public InventarioController(InventarioService inventario) {
        this.inventario = inventario;
    }

    @GetMapping
    public List<InventarioItem> listar() {
        return inventario.listar();
    }

    @PostMapping("/{productoId}/movimientos")
    public InventarioItem mover(@PathVariable Long productoId, @Valid @RequestBody MovimientoRequest req,
                                Authentication auth) {
        return inventario.registrarMovimiento(productoId, req, auth.getName());
    }

    @PutMapping("/{productoId}/minimo")
    public InventarioItem minimo(@PathVariable Long productoId, @Valid @RequestBody MinimoRequest req) {
        return inventario.actualizarMinimo(productoId, req.stockMinimo());
    }

    @GetMapping("/{productoId}/movimientos")
    public List<MovimientoResponse> historial(@PathVariable Long productoId) {
        return inventario.historial(productoId);
    }
}
