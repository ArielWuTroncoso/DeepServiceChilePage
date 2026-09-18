package cl.deepservice.repository;

import cl.deepservice.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    Optional<Producto> findBySlug(String slug);

    boolean existsBySlug(String slug);

    /** Búsqueda del catálogo público: filtros opcionales por categoría, marca y texto. */
    @Query("""
           SELECT DISTINCT p FROM Producto p
           JOIN FETCH p.categoria c
           JOIN FETCH p.marca m
           WHERE p.activo = true
             AND (:categoria IS NULL OR c.slug = :categoria)
             AND (:marca IS NULL OR m.slug = :marca)
             AND (:q IS NULL
                  OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :q, '%'))
                  OR LOWER(p.resumen) LIKE LOWER(CONCAT('%', :q, '%')))
           ORDER BY p.destacado DESC, p.nombre ASC
           """)
    List<Producto> buscar(@Param("categoria") String categoria,
                          @Param("marca") String marca,
                          @Param("q") String q);

    long countByCategoriaSlug(String slug);

    long countByMarcaSlug(String slug);
}
