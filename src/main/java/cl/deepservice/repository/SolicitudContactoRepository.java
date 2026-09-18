package cl.deepservice.repository;

import cl.deepservice.model.SolicitudContacto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SolicitudContactoRepository extends JpaRepository<SolicitudContacto, Long> {
    List<SolicitudContacto> findAllByOrderByFechaCreacionDesc();
}
