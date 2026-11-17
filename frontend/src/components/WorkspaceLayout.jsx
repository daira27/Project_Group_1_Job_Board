import { NavLink } from 'react-router';

export default function WorkspaceLayout({ title, children }) {
  return (
    <div className="workspace-layout">
      <aside className="workspace-sidebar panel">
        <p className="eyebrow">{title}</p>
        <nav aria-label="Workspace navigation">
          <NavLink to="/profile">My profile</NavLink>
          <NavLink to="/employer">Employer dashboard</NavLink>
        </nav>
      </aside>
      <div className="workspace-content">{children}</div>
    </div>
  );
}
