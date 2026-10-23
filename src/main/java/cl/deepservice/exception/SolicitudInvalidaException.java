package cl.deepservice.exception;

/** La solicitud no se puede atender tal como viene (responde 400). */
public class SolicitudInvalidaException extends RuntimeException {
    public SolicitudInvalidaException(String mensaje) {
        super(mensaje);
    }
}
