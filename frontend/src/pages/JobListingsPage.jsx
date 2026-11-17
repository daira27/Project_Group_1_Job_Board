import { Link } from 'react-router';
import PlaceholderPanel from '../components/PlaceholderPanel.jsx';

export default function JobListingsPage() {
  return (
    <>
      <section className="hero panel" aria-labelledby="hero-heading">
        <h1 id="hero-heading">Find Your Next Opportunity</h1>
        <p className="description">Connect with employers and discover opportunities that match your skills and interests. Take the next step in your career.</p>
        <div className="search-controls">
          <div className="search-field">
            <label htmlFor="job-search">Job title or keyword</label>
            <input type="search" id="job-search" placeholder="e.g. Frontend developer" aria-describedby="search-note" disabled />
          </div>
          <button type="button" disabled>Search Jobs</button>
        </div>
        <p className="field-note" id="search-note">Job search will be available soon.</p>
      </section>
      <PlaceholderPanel title="Job listings">
        <p>Available opportunities will appear here. Job listings and filters are coming soon.</p>
        <Link className="button button-secondary" to="/jobs/preview">Preview job details</Link>
      </PlaceholderPanel>
    </>
  );
}
