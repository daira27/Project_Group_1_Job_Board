export default function PlaceholderPanel({ title, children }) {
  return (
    <section className="panel placeholder-panel">
      <p className="eyebrow">Coming soon</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
