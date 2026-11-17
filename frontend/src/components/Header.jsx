import { Link, NavLink } from 'react-router';

export default function Header({ user, onLogout }) {
  return (
    <header className="site-header">
      <div className="container header-content">
        <Link className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">JP</span> Online Job Portal
        </Link>
        <nav className="primary-nav" aria-label="Main navigation">
          <NavLink to="/" end>Find Jobs</NavLink>
          {user && <NavLink to="/profile">My Profile</NavLink>}
          {user?.role === 'employer' && <NavLink to="/employer">Employer Dashboard</NavLink>}
        </nav>
        <nav className="account-nav" aria-label="Account navigation">
          {user ? (
            <button className="button-secondary" type="button" onClick={onLogout}>Logout</button>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink className="button" to="/signup">Sign Up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
