package cl.deepservice.repository;

import cl.deepservice.model.Marca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MarcaRepository extends JpaRepository<Marca, Long> {
    Optional<Marca> findBySlug(String slug);
    List<Marca> findAllByOrderByNombreAsc();
}
