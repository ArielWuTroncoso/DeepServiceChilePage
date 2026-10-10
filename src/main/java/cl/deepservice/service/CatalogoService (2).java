package cl.deepservice.service;

import cl.deepservice.dto.Dtos.*;
import cl.deepservice.exception.RecursoNoEncontradoException;
import cl.deepservice.exception.ReglaNegocioException;
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
        return productos.buscar(limpiar(categoria), limpiar(marca), limpiar(q)).stream()
                .map(this::aResumen)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductoDetalle obtener(String slug) {
        Producto p = productos.findBySlug(slug)
                .orElseThrow(() -> new RecursoNoEncontradoException("No encontramos el producto solicitado"));

        List<EspecificacionDto> specs = p.getEspecificaciones().stream()
                .sorted(Comparator.comparing(Especificacion::getOrden))
                .map(e -> new EspecificacionDto(e.getClave(), e.getValor(), e.getOrden()))
                .toList();

        return new ProductoDetalle(p.getId(), p.getSlug(), p.getNombre(), p.getSubcategoria(),
                p.getResumen(), p.getDescripcion(), p.getCategoria().getSlug(), p.getMarca().getSlug(),
                p.getImagenUrl(), Boolean.TRUE.equals(p.getDestacado()), Boolean.TRUE.equals(p.getCompleto()), specs);
    }

    @Transactional
    public ProductoDetalle crear(ProductoRequest req) {
        if (productos.existsBySlug(req.slug())) {
            throw new ReglaNegocioException("Ya existe un producto con ese identificador");
        }
        Producto p = new Producto();
        aplicar(p, req);
        productos.save(p);
        return obtener(p.getSlug());
    }

    @Transactional
    public ProductoDetalle actualizar(Long id, ProductoRequest req) {
        Producto p = productos.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No encontramos el producto solicitado"));
        p.getEspecificaciones().clear();
        aplicar(p, req);
        productos.save(p);
        return obtener(p.getSlug());
    }

    @Transactional
    public void eliminar(Long id) {
        Producto p = productos.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No encontramos el producto solicitado"));
        p.setActivo(false);   // baja logica: conserva el historial
        productos.save(p);
    }

    // ----- apoyo -----

    private void aplicar(Producto p, ProductoRequest req) {
        p.setSlug(req.slug());
        p.setNombre(req.nombre());
        p.setSubcategoria(req.subcategoria());
        p.setResumen(req.resumen());
        p.setDescripcion(req.descripcion());
        p.setImagenUrl(req.imagenUrl());
        p.setDestacado(Boolean.TRUE.equals(req.destacado()));
        p.setCompleto(Boolean.TRUE.equals(req.completo()));
        p.setCategoria(categorias.findBySlug(req.categoria())
                .orElseThrow(() -> new ReglaNegocioException("La categoria indicada no existe")));
        p.setMarca(marcas.findBySlug(req.marca())
                .orElseThrow(() -> new ReglaNegocioException("La marca indicada no existe")));

        if (req.especificaciones() != null) {
            int orden = 0;
            for (EspecificacionDto e : req.especificaciones()) {
                p.agregarEspecificacion(new Especificacion(e.clave(), e.valor(),
                        e.orden() != null ? e.orden() : orden++));
            }
        }
    }

    private ProductoResumen aResumen(Producto p) {
        return new ProductoResumen(p.getId(), p.getSlug(), p.getNombre(), p.getSubcategoria(),
                p.getResumen(), p.getCategoria().getSlug(), p.getMarca().getSlug(), p.getImagenUrl(),
                Boolean.TRUE.equals(p.getDestacado()), Boolean.TRUE.equals(p.getCompleto()));
    }

    private String limpiar(String valor) {
        return StringUtils.hasText(valor) ? valor.trim() : null;
    }
}
