export default function CardSkeleton({ count = 3, label = 'Cargando contenido' }) {
  return (
    <div className="ds-container ds-section">
      <div className="ds-grid ds-grid--3" role="status" aria-label={label}>
        {Array.from({ length: count }).map((_, i) => (
          <div className="ds-skel-card" key={i}>
            <div className="ds-skel" style={{ height: 150 }} />
            <div className="ds-skel" style={{ height: 18, width: '55%' }} />
            <div className="ds-skel" style={{ height: 14 }} />
            <div className="ds-skel" style={{ height: 14, width: '80%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
