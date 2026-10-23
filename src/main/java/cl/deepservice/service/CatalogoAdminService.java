package cl.deepservice.service;

import cl.deepservice.dto.Dtos.EspecificacionDto;
import cl.deepservice.dto.Dtos.ProductoAdmin;
import cl.deepservice.dto.Dtos.ProductoRequest;
import cl.deepservice.exception.RecursoNoEncontradoException;
import cl.deepservice.exception.ReglaNegocioException;
import cl.deepservice.model.Especificacion;
import cl.deepservice.model.Producto;
import cl.deepservice.repository.CategoriaRepository;
import cl.deepservice.repository.MarcaRepository;
import cl.deepservice.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

/** Alta, edición y baja de equipos desde el panel de administración. */
@Service
public class CatalogoAdminService {

    private final ProductoRepository productos;
    private final CategoriaRepository categorias;
    private final MarcaRepository marcas;
    private final InventarioService inventario;

    public CatalogoAdminService(ProductoRepository productos, CategoriaRepository categorias,
                                MarcaRepository marcas, InventarioService inventario) {
        this.productos = productos;
        this.categorias = categorias;
        this.marcas = marcas;
        this.inventario = inventario;
    }

    @Transactional(readOnly = true)
    public List<ProductoAdmin> listar() {
        return productos.listarTodosConDetalle().stream().map(this::aDto).toList();
    }

    @Transactional
    public ProductoAdmin crear(ProductoRequest req) {
        if (productos.existsBySlug(req.slug())) {
            throw new ReglaNegocioException("Ya existe un equipo con ese identificador");
        }
        Producto p = new Producto();
        p.setSlug(req.slug());
        aplicar(p, req);
        Producto guardado = productos.save(p);
        inventario.asegurar(guardado.getId());
        return aDto(guardado);
    }

    /** El identificador (slug) no se modifica: los enlaces y el sitio público dependen de él. */
    @Transactional
    public ProductoAdmin actualizar(Long id, ProductoRequest req) {
        Producto p = buscar(id);
        p.getEspecificaciones().clear();
        aplicar(p, req);
        return aDto(productos.save(p));
    }

    /** Baja o reactivación: el equipo deja de verse en el sitio público, pero no se borra. */
    @Transactional
    public ProductoAdmin cambiarActivo(Long id, boolean activo) {
        Producto p = buscar(id);
        p.setActivo(activo);
        return aDto(productos.save(p));
    }

    // ----- apoyo -----

    private Producto buscar(Long id) {
        return productos.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No encontramos el equipo"));
    }

    private void aplicar(Producto p, ProductoRequest req) {
        p.setNombre(req.nombre().trim());
        p.setSubcategoria(limpiar(req.subcategoria()));
        p.setResumen(limpiar(req.resumen()));
        p.setDescripcion(limpiar(req.descripcion()));
        p.setImagenUrl(limpiar(req.imagenUrl()));
        if (req.destacado() != null) p.setDestacado(req.destacado());
        if (req.completo() != null) p.setCompleto(req.completo());
        if (req.activo() != null) p.setActivo(req.activo());
        p.setCategoria(categorias.findBySlug(req.categoria())
                .orElseThrow(() -> new ReglaNegocioException("La categoría indicada no existe")));
        p.setMarca(marcas.findBySlug(req.marca())
                .orElseThrow(() -> new ReglaNegocioException("La marca indicada no existe")));

        if (req.especificaciones() != null) {
            int orden = 0;
            for (EspecificacionDto e : req.especificaciones()) {
                p.agregarEspecificacion(new Especificacion(e.clave().trim(), e.valor().trim(), orden++));
            }
        }
    }

    private ProductoAdmin aDto(Producto p) {
        List<EspecificacionDto> specs = p.getEspecificaciones().stream()
                .sorted(Comparator.comparing(Especificacion::getOrden))
                .map(e -> new EspecificacionDto(e.getClave(), e.getValor(), e.getOrden()))
                .toList();
        return new ProductoAdmin(p.getId(), p.getSlug(), p.getNombre(), p.getSubcategoria(), p.getResumen(),
                p.getDescripcion(), p.getCategoria().getSlug(), p.getMarca().getSlug(), p.getImagenUrl(),
                Boolean.TRUE.equals(p.getDestacado()), Boolean.TRUE.equals(p.getCompleto()),
                Boolean.TRUE.equals(p.getActivo()), specs);
    }

    private static String limpiar(String texto) {
        if (texto == null) return null;
        String t = texto.trim();
        return t.isEmpty() ? null : t;
    }
}
