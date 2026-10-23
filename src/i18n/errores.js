/**
 * Los mensajes de error del backend vienen en español. En inglés se traducen
 * según el código de respuesta; en español se conserva el mensaje original.
 *
 * `contexto: 'panel'` evita textos pensados para el registro de cuentas (el 409 del registro
 * dice "correo ya registrado", que en el panel no tiene sentido).
 */
export function mensajeError(err, idioma, { contexto } = {}) {
  if (idioma !== 'en') return err?.message || 'La solicitud no pudo completarse.';
  switch (err?.status) {
    case 0: return 'Could not connect to the server. Please check your connection and try again.';
    case 400: return 'Please check the information you entered.';
    case 401: return contexto === 'panel' ? 'Your session has expired. Please sign in again.' : 'Incorrect email or password.';
    case 403: return 'You do not have permission to perform this action.';
    case 404: return 'The requested resource was not found.';
    case 409: return contexto === 'panel' ? 'That change conflicts with existing data.' : 'That email address is already registered.';
    case 413: return 'The request is too large.';
    case 429: return 'Too many attempts. Please wait a few minutes and try again.';
    default: return 'The request could not be completed. Please try again.';
  }
}

/**
 * Detalle de un error de validación (400): devuelve las observaciones del servidor sin el nombre
 * técnico del campo, para mostrarlas bajo el mensaje principal. En inglés no se muestra (viene en español).
 */
export function detallesError(err, idioma) {
  if (idioma === 'en') return [];
  const d = err?.payload?.detalles;
  if (!Array.isArray(d)) return [];
  return d.map((x) => String(x).replace(/^[\w.[\]]+:\s*/, '')).filter(Boolean).slice(0, 4);
}
