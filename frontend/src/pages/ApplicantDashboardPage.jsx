import { Link } from 'react-router';
import WorkspaceLayout from '../components/WorkspaceLayout.jsx';

// null means the API is not connected; an empty array means there are no results.
export default function ApplicantDashboardPage({ user, applications = null }) {
  return (
    <WorkspaceLayout title="Job seeker workspace" user={user}>
      <div className="page-heading">
        <h1>My dashboard</h1>
        <p>View your applications and follow their progress.</p>
      </div>
      <section className="panel" aria-labelledby="applications-heading">
        <h2 id="applications-heading">My applications</h2>
        {applications === null ? (
          <p role="status">Applications cannot be loaded yet because the application service is not connected.</p>
        ) : applications.length === 0 ? (
          <p>You have not submitted any applications yet. <Link to="/">Find jobs</Link> to get started.</p>
        ) : (
          <ul className="account-list">
            {applications.map((application) => {
              const date = application.applied_at ? new Date(application.applied_at) : null;

              return (
                <li key={application.id}>
                  <h3><Link to={`/jobs/${application.job_id}`}>{application.job_title || `Job #${application.job_id}`}</Link></h3>
                  <p>{application.employer || 'Employer not provided'}</p>
                  {date && !Number.isNaN(date.getTime()) && (
                    <p className="field-note">Applied on <time dateTime={application.applied_at}>{date.toLocaleDateString()}</time></p>
                  )}
                  <p>Status: <span className="job-tag">{application.status || 'Not provided'}</span></p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </WorkspaceLayout>
  );
}
