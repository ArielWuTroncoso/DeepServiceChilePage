package cl.deepservice.service;

import cl.deepservice.dto.Dtos.ContactoRequest;
import cl.deepservice.dto.Dtos.ContactoResponse;
import cl.deepservice.exception.RecursoNoEncontradoException;
import cl.deepservice.model.SolicitudContacto;
import cl.deepservice.repository.SolicitudContactoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ContactoService {

    private final SolicitudContactoRepository solicitudes;

    public ContactoService(SolicitudContactoRepository solicitudes) {
        this.solicitudes = solicitudes;
    }

    @Transactional
    public ContactoResponse registrar(ContactoRequest req) {
        SolicitudContacto s = new SolicitudContacto();
        s.setNombre(req.nombre().trim());
        s.setEmpresa(req.empresa());
        s.setCorreo(req.correo().trim().toLowerCase());
        s.setTelefono(req.telefono());
        s.setEmbarcacion(req.embarcacion());
        s.setInteres(req.interes());
        s.setProductoSlug(req.productoSlug());
        s.setMensaje(req.mensaje().trim());
        return aDto(solicitudes.save(s));
    }

    @Transactional(readOnly = true)
    public List<ContactoResponse> listar() {
        return solicitudes.findAllByOrderByFechaCreacionDesc().stream().map(this::aDto).toList();
    }

    @Transactional
    public ContactoResponse atender(Long id) {
        SolicitudContacto s = solicitudes.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("No encontramos la solicitud"));
        s.setAtendida(true);
        return aDto(solicitudes.save(s));
    }

    private ContactoResponse aDto(SolicitudContacto s) {
        return new ContactoResponse(s.getId(), s.getNombre(), s.getEmpresa(), s.getCorreo(),
                s.getTelefono(), s.getEmbarcacion(), s.getInteres(), s.getProductoSlug(),
                s.getMensaje(), Boolean.TRUE.equals(s.getAtendida()), s.getFechaCreacion());
    }
}
