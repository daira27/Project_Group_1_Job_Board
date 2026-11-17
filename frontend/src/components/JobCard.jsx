import { Link } from 'react-router';
import { companyName, formatSalary } from '../utils/jobs.js';

export default function JobCard({ job, search }) {
  const company = companyName(job);
  const salary = formatSalary(job);
  const description = job.description || 'A description has not been provided.';
  const summary = description.length > 180 ? `${description.slice(0, 177).trimEnd()}…` : description;

  return (
    <article className="panel job-card" aria-labelledby={`job-title-${job.id}`}>
      <div className="job-card-heading">
        <div className="company-mark" aria-hidden="true">{company.split(/\s+/).slice(0, 2).map((word) => word[0]).join('')}</div>
        <div>
          <h3 id={`job-title-${job.id}`}>{job.title}</h3>
          <p className="job-company">{company}</p>
        </div>
        <span className="job-tag">{job.job_type || 'Type not specified'}</span>
      </div>
      <p className="job-meta">{job.location || 'Location not specified'}{salary && ` · Salary: ${salary}`}</p>
      <p className="job-summary">{summary}</p>
      <div className="job-card-actions">
        <Link className="button button-secondary" to={`/jobs/${job.id}${search ? `?${search}` : ''}`} aria-label={`View details for ${job.title} at ${company}`}>
          View Details
        </Link>
      </div>
    </article>
  );
}
