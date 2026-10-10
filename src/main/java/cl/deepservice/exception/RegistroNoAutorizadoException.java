package cl.deepservice.exception;

/** El registro de administradores esta cerrado o el codigo de autorizacion no es valido. */
public class RegistroNoAutorizadoException extends RuntimeException {
    public RegistroNoAutorizadoException(String mensaje) { super(mensaje); }
}
