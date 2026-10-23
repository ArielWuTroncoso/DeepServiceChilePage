package cl.deepservice.service;

import cl.deepservice.dto.Dtos.InventarioItem;
import cl.deepservice.dto.Dtos.MovimientoRequest;
import cl.deepservice.dto.Dtos.MovimientoResponse;
import cl.deepservice.exception.RecursoNoEncontradoException;
import cl.deepservice.model.Inventario;
import cl.deepservice.model.MovimientoStock;
import cl.deepservice.model.Producto;
import cl.deepservice.repository.InventarioRepository;
import cl.deepservice.repository.MovimientoStockRepository;
import cl.deepservice.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Existencias de cada equipo. Solo lo usan los controladores bajo /api/admin:
 * ningún dato de inventario sale por la API pública.
 */
@Service
public class InventarioService {

    private final ProductoRepository productos;
    private final InventarioRepository inventarios;
    private final MovimientoStockRepository movimientos;

    public InventarioService(ProductoRepository productos, InventarioRepository inventarios,
                             MovimientoStockRepository movimientos) {
        this.productos = productos;
        this.inventarios = inventarios;
        this.movimientos = movimientos;
    }

    @Transactional(readOnly = true)
    public List<InventarioItem> listar() {
        Map<Long, Inventario> porProducto = new HashMap<>();
        for (Inventario i : inventarios.findAll()) porProducto.put(i.getProductoId(), i);
        return productos.listarConClasificacion().stream()
                .map(p -> aItem(p, porProducto.get(p.getId())))
                .toList();
    }

    /** Suma, resta o fija el stock de un equipo y deja constancia de quién lo hizo. */
    @Transactional
    public InventarioItem registrarMovimiento(Long productoId, MovimientoRequest req, String usuario) {
        Producto p = buscarProducto(productoId);
        Inventario inv = bloquearOCrear(productoId);

        int stock = inv.aplicar(req.tipo(), req.cantidad());
        inventarios.save(inv);

        MovimientoStock m = new MovimientoStock();
        m.setProductoId(productoId);
        m.setTipo(req.tipo());
        m.setCantidad(req.cantidad());
        m.setStockResultante(stock);
        m.setMotivo(limpiar(req.motivo()));
        m.setUsuario(usuario);
        movimientos.save(m);

        return aItem(p, inv);
    }

    @Transactional
    public InventarioItem actualizarMinimo(Long productoId, int stockMinimo) {
        Producto p = buscarProducto(productoId);
        Inventario inv = bloquearOCrear(productoId);
        inv.setStockMinimo(stockMinimo);
        inventarios.save(inv);
        return aItem(p, inv);
    }

    @Transactional(readOnly = true)
    public List<MovimientoResponse> historial(Long productoId) {
        buscarProducto(productoId);
        return movimientos.findTop50ByProductoIdOrderByFechaDescIdDesc(productoId).stream()
                .map(m -> new MovimientoResponse(m.getId(), m.getProductoId(), m.getTipo().name(),
                        m.getCantidad(), m.getStockResultante(), m.getMotivo(), m.getUsuario(), m.getFecha()))
                .toList();
    }

    /** Crea la fila de inventario (en 0) de un equipo que todavía no la tiene. */
    @Transactional
    public void asegurar(Long productoId) {
        if (!inventarios.existsById(productoId)) {
            inventarios.save(new Inventario(productoId));
        }
    }

    /** Deja todos los equipos con su fila de inventario. Se ejecuta al iniciar el servidor. */
    @Transactional
    public void asegurarTodos() {
        for (Producto p : productos.findAll()) asegurar(p.getId());
    }

    // ----- apoyo -----

    private Producto buscarProducto(Long id) {
        return productos.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No encontramos el equipo"));
    }

    private Inventario bloquearOCrear(Long productoId) {
        return inventarios.bloquear(productoId).orElseGet(() -> {
            inventarios.saveAndFlush(new Inventario(productoId));
            return inventarios.bloquear(productoId).orElseThrow();
        });
    }

    private InventarioItem aItem(Producto p, Inventario inv) {
        int stock = inv == null || inv.getStock() == null ? 0 : inv.getStock();
        int minimo = inv == null || inv.getStockMinimo() == null ? 0 : inv.getStockMinimo();
        return new InventarioItem(p.getId(), p.getSlug(), p.getNombre(), p.getSubcategoria(),
                p.getCategoria().getSlug(), p.getMarca().getSlug(), Boolean.TRUE.equals(p.getActivo()),
                stock, minimo, inv == null ? null : inv.getActualizadoEn());
    }

    private static String limpiar(String texto) {
        if (texto == null) return null;
        String t = texto.trim();
        return t.isEmpty() ? null : t;
    }
}
