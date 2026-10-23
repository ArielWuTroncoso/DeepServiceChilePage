package cl.deepservice.repository;

import cl.deepservice.model.Inventario;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {

    /**
     * Busca el inventario de un equipo bloqueando la fila hasta terminar la
     * transacción: dos movimientos simultáneos sobre el mismo equipo se aplican
     * uno tras otro y el stock nunca queda mal calculado.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM Inventario i WHERE i.productoId = :productoId")
    Optional<Inventario> bloquear(@Param("productoId") Long productoId);
}
