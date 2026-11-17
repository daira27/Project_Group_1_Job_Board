import { NavLink } from 'react-router';

export default function WorkspaceLayout({ title, user, children }) {
  return (
    <div className="workspace-layout">
      <aside className="workspace-sidebar panel">
        <p className="eyebrow">{title}</p>
        <p>{user.name}</p>
        <nav aria-label="Workspace navigation">
          <NavLink to="/profile">My profile</NavLink>
          {user.role === 'applicant' && <NavLink to="/dashboard">My applications</NavLink>}
          {user.role === 'applicant' && <NavLink to="/notifications">Notifications</NavLink>}
          {user.role === 'employer' && <NavLink to="/employer">Employer dashboard</NavLink>}
        </nav>
      </aside>
      <div className="workspace-content">{children}</div>
    </div>
  );
}
