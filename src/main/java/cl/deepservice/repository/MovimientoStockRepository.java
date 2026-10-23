package cl.deepservice.repository;

import cl.deepservice.model.MovimientoStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimientoStockRepository extends JpaRepository<MovimientoStock, Long> {

    /** Los 50 movimientos más recientes de un equipo. */
    List<MovimientoStock> findTop50ByProductoIdOrderByFechaDescIdDesc(Long productoId);
}
