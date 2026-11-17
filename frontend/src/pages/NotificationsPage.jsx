import WorkspaceLayout from '../components/WorkspaceLayout.jsx';

export default function NotificationsPage({ user, notifications = null }) {
  return (
    <WorkspaceLayout title="Job seeker workspace" user={user}>
      <div className="page-heading">
        <h1>Notifications</h1>
        <p>Updates about your job applications.</p>
      </div>
      <section className="panel" aria-labelledby="updates-heading">
        <h2 id="updates-heading">Application updates</h2>
        {notifications === null ? (
          <p role="status">Notifications cannot be loaded yet because the notification service is not connected.</p>
        ) : notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          <ul className="account-list">
            {notifications.map((notification) => {
              const date = notification.created_at ? new Date(notification.created_at) : null;

              return (
                <li key={notification.id}>
                  {notification.job_title && <h3>{notification.job_title}</h3>}
                  <p>{notification.message}</p>
                  {date && !Number.isNaN(date.getTime()) && (
                    <p className="field-note"><time dateTime={notification.created_at}>{date.toLocaleString()}</time></p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </WorkspaceLayout>
  );
}
