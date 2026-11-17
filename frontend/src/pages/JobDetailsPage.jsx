import { Link } from 'react-router';
import PlaceholderPanel from '../components/PlaceholderPanel.jsx';

export default function JobDetailsPage() {
  return (
    <>
      <Link className="back-link" to="/">&larr; Back to job search</Link>
      <div className="page-heading">
        <h1>Job details</h1>
        <p>Learn more about your next opportunity.</p>
      </div>
      <div className="two-column-layout">
        <PlaceholderPanel title="About the role">
          <p>The job title, employer, location, description, and requirements will appear here when listings are available.</p>
        </PlaceholderPanel>
        <PlaceholderPanel title="Apply for this job">
          <p>Applications will be available in a future update.</p>
          <button type="button" disabled>Apply Now</button>
        </PlaceholderPanel>
      </div>
    </>
  );
}
