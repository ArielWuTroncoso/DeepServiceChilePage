package cl.deepservice.exception;

/** Se superó el límite de intentos permitido. */
public class ExcesoSolicitudesException extends RuntimeException {

    private final long segundosParaReintentar;

    public ExcesoSolicitudesException(long segundosParaReintentar) {
        super("Demasiados intentos. Espera unos minutos antes de volver a intentarlo.");
        this.segundosParaReintentar = Math.max(1, segundosParaReintentar);
    }

    public long getSegundosParaReintentar() {
        return segundosParaReintentar;
    }
}
