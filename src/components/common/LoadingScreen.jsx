export default function LoadingScreen({ mensaje = 'Cargando' }) {
  return (
    <div className="ds-loading" role="status" aria-live="polite">
      <span className="ds-spinner" aria-hidden="true" />
      <p>{mensaje}…</p>
    </div>
  );
}
