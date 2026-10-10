package cl.deepservice.repository;

import cl.deepservice.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Optional<Categoria> findBySlug(String slug);
    List<Categoria> findAllByOrderByOrdenAsc();
}
