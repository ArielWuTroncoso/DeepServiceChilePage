export default function SectionHead({ barra, titulo, descripcion, alineado = 'izquierda' }) {
  return (
    <header className="ds-section__head" style={alineado === 'centro' ? { marginInline: 'auto', textAlign: 'center' } : undefined}>
      {barra && <span className="ds-barlabel">{barra}</span>}
      <h2 className="ds-display ds-h2">{titulo}</h2>
      {descripcion && <p className="ds-lead">{descripcion}</p>}
    </header>
  );
}
