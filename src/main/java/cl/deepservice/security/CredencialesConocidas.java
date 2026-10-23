package cl.deepservice.security;

/**
 * Credencial de la primera versión del sitio. Estuvo escrita en el README y en el
 * código, por lo que debe tratarse como pública: se conserva solo para DETECTARLA
 * (avisar y exigir el cambio), nunca para crear cuentas.
 */
public final class CredencialesConocidas {

    public static final String CORREO_INICIAL = "admin@deepservicechile.cl";
    public static final String CLAVE_INICIAL = "DeepService2026";

    /** Secreto de firma que venía por defecto en application.yaml y .env.example. */
    public static final String JWT_SECRET_PUBLICO =
            "6B59703373367639792F423F4528482B4D6251655468576D5A7134743777217A";

    private CredencialesConocidas() { }
}
