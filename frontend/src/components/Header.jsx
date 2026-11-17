import { Link, NavLink } from 'react-router';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">JP</span> Online Job Portal
        </Link>
        <nav className="primary-nav" aria-label="Main navigation">
          <NavLink to="/" end>Find Jobs</NavLink>
          <NavLink to="/profile">Job Seeker</NavLink>
          <NavLink to="/employer">Employer</NavLink>
        </nav>
        <nav className="account-nav" aria-label="Account navigation">
          <NavLink to="/login">Login</NavLink>
          <NavLink className="button" to="/signup">Sign Up</NavLink>
        </nav>
      </div>
    </header>
  );
}
