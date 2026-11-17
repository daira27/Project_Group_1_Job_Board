import PlaceholderPanel from '../components/PlaceholderPanel.jsx';
import WorkspaceLayout from '../components/WorkspaceLayout.jsx';

export default function EmployerPage() {
  return (
    <WorkspaceLayout title="Employer workspace">
      <div className="page-heading">
        <h1>Employer dashboard</h1>
        <p>Manage your job postings and find your next teammate.</p>
      </div>
      <div className="two-column-layout">
        <PlaceholderPanel title="My jobs">
          <p>Your job postings and applicants will appear here. Job management is coming soon.</p>
        </PlaceholderPanel>
        <PlaceholderPanel title="Post a job">
          <p>A form for creating job listings will be available in a future update.</p>
          <button type="button" disabled>Post Job</button>
        </PlaceholderPanel>
      </div>
    </WorkspaceLayout>
  );
}
