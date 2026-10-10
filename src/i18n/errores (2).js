/**
 * Los mensajes de error del backend vienen en español. En inglés se traducen
 * según el código de respuesta; en español se conserva el mensaje original.
 */
export function mensajeError(err, idioma) {
  if (idioma !== 'en') return err?.message || 'La solicitud no pudo completarse.';
  switch (err?.status) {
    case 0: return 'Could not connect to the server. Please check your connection and try again.';
    case 400: return 'Please check the information you entered.';
    case 401: return 'Incorrect email or password.';
    case 403: return 'You do not have permission to perform this action.';
    case 404: return 'The requested resource was not found.';
    case 409: return 'That email address is already registered.';
    default: return 'The request could not be completed. Please try again.';
  }
}
