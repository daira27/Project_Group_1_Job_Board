import PlaceholderPanel from '../components/PlaceholderPanel.jsx';
import WorkspaceLayout from '../components/WorkspaceLayout.jsx';

export default function JobSeekerPage() {
  return (
    <WorkspaceLayout title="Job seeker workspace">
      <div className="page-heading">
        <h1>My dashboard</h1>
        <p>Manage your profile and keep track of your next opportunity.</p>
      </div>
      <PlaceholderPanel title="My profile">
        <p>Your skills, experience, and resume will appear here. Profile editing is coming soon.</p>
      </PlaceholderPanel>
      <PlaceholderPanel title="My applications">
        <p>Your submitted applications and their status will appear here when applications are available.</p>
      </PlaceholderPanel>
    </WorkspaceLayout>
  );
}
