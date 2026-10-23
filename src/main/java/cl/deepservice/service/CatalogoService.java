package cl.deepservice.service;

import cl.deepservice.dto.Dtos.*;
import cl.deepservice.exception.RecursoNoEncontradoException;
import cl.deepservice.model.Especificacion;
import cl.deepservice.model.Producto;
import cl.deepservice.repository.CategoriaRepository;
import cl.deepservice.repository.MarcaRepository;
import cl.deepservice.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Comparator;
import java.util.List;

@Service
public class CatalogoService {

    private final CategoriaRepository categorias;
    private final MarcaRepository marcas;
    private final ProductoRepository productos;

    public CatalogoService(CategoriaRepository categorias, MarcaRepository marcas, ProductoRepository productos) {
        this.categorias = categorias;
        this.marcas = marcas;
        this.productos = productos;
    }

    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarCategorias() {
        return categorias.findAllByOrderByOrdenAsc().stream()
                .map(c -> new CategoriaResponse(c.getId(), c.getSlug(), c.getNombre(),
                        c.getDescripcion(), c.getIcono(), productos.countByCategoriaSlug(c.getSlug())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MarcaResponse> listarMarcas() {
        return marcas.findAllByOrderByNombreAsc().stream()
                .map(m -> new MarcaResponse(m.getId(), m.getSlug(), m.getNombre(), m.getDescripcion(),
                        m.getLogoUrl(), Boolean.TRUE.equals(m.getDestacada()), productos.countByMarcaSlug(m.getSlug())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ProductoResumen> listarProductos(String categoria, String marca, String q) {
        String cat = StringUtils.hasText(categoria) ? categoria.trim() : "";
        String mar = StringUtils.hasText(marca) ? marca.trim() : "";
        String patron = StringUtils.hasText(q) ? "%" + q.trim().toLowerCase() + "%" : "";
        return productos.buscar(cat, mar, patron).stream()
                .map(this::aResumen)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoDetalle obtener(String slug) {
        Producto p = productos.findBySlugAndActivoTrue(slug)
                .orElseThrow(() -> new RecursoNoEncontradoException("No encontramos el producto solicitado"));
        return aDetalle(p);
    }

    /**
     * Estado del catálogo para el sitio público: equipos activos (con su ficha, para poder mostrar
     * los que se agregan desde el panel) y los identificadores de los dados de baja.
     * Es lo único del panel que el sitio necesita; no trae existencias ni datos internos.
     */
    @Transactional(readOnly = true)
    public EstadoCatalogo estado() {
        List<ProductoDetalle> activos = productos.listarTodosConDetalle().stream()
                .filter(p -> Boolean.TRUE.equals(p.getActivo()))
                .map(this::aDetalle)
                .toList();
        return new EstadoCatalogo(activos, productos.slugsInactivos());
    }

    private ProductoDetalle aDetalle(Producto p) {
        List<EspecificacionDto> specs = p.getEspecificaciones().stream()
                .sorted(Comparator.comparing(Especificacion::getOrden))
                .map(e -> new EspecificacionDto(e.getClave(), e.getValor(), e.getOrden()))
                .toList();
        return new ProductoDetalle(p.getId(), p.getSlug(), p.getNombre(), p.getSubcategoria(),
                p.getResumen(), p.getDescripcion(), p.getCategoria().getSlug(), p.getMarca().getSlug(),
                p.getImagenUrl(), Boolean.TRUE.equals(p.getDestacado()), Boolean.TRUE.equals(p.getCompleto()), specs);
    }

    private ProductoResumen aResumen(Producto p) {
        return new ProductoResumen(p.getId(), p.getSlug(), p.getNombre(), p.getSubcategoria(),
                p.getResumen(), p.getCategoria().getSlug(), p.getMarca().getSlug(), p.getImagenUrl(),
                Boolean.TRUE.equals(p.getDestacado()), Boolean.TRUE.equals(p.getCompleto()));
    }
}
