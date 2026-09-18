package cl.deepservice.controller;

import cl.deepservice.dto.Dtos.*;
import cl.deepservice.service.CatalogoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CatalogoController {

    private final CatalogoService catalogo;

    public CatalogoController(CatalogoService catalogo) {
        this.catalogo = catalogo;
    }

    @GetMapping("/categorias")
    public List<CategoriaResponse> categorias() {
        return catalogo.listarCategorias();
    }

    @GetMapping("/marcas")
    public List<MarcaResponse> marcas() {
        return catalogo.listarMarcas();
    }

    @GetMapping("/productos")
    public List<ProductoResumen> productos(@RequestParam(required = false) String categoria,
                                           @RequestParam(required = false) String marca,
                                           @RequestParam(required = false) String q) {
        return catalogo.listarProductos(categoria, marca, q);
    }

    @GetMapping("/productos/{slug}")
    public ProductoDetalle producto(@PathVariable String slug) {
        return catalogo.obtener(slug);
    }

    @PostMapping("/productos")
    public ResponseEntity<ProductoDetalle> crear(@Valid @RequestBody ProductoRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogo.crear(req));
    }

    @PutMapping("/productos/{id}")
    public ProductoDetalle actualizar(@PathVariable Long id, @Valid @RequestBody ProductoRequest req) {
        return catalogo.actualizar(id, req);
    }

    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        catalogo.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
