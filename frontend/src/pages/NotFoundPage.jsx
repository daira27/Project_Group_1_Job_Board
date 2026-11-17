import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section className="panel">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className="button" to="/">Back to Find Jobs</Link>
    </section>
  );
}
