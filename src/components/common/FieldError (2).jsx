export default function FieldError({ mensaje, id }) {
  if (!mensaje) return null;
  return <span className="field__err" id={id} role="alert">{mensaje}</span>;
}
