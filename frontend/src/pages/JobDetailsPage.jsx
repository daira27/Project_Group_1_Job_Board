import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import PlaceholderPanel from '../components/PlaceholderPanel.jsx';
import JobDataNotice from '../components/JobDataNotice.jsx';
import JobRequestState from '../components/JobRequestState.jsx';
import { getJob } from '../services/jobs.js';
import { companyName, formatSalary } from '../utils/jobs.js';

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const { search } = useLocation();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadJob() {
      setLoading(true);
      setError(null);
      try {
        const result = await getJob(jobId, { signal: controller.signal });
        if (!controller.signal.aborted) {
          setJob(result);
          document.title = `${result.title} | Online Job Portal`;
        }
      } catch (requestError) {
        if (!controller.signal.aborted) setError(requestError);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadJob();
    return () => controller.abort();
  }, [jobId, retryCount]);

  const salary = job ? formatSalary(job) : '';

  return (
    <>
      <JobDataNotice />
      <Link className="back-link" to={`/${search}`}>&larr; Back to job search</Link>
      {loading || error ? (
        <>
          <h1 className="page-heading">Job details</h1>
          <JobRequestState loading={loading} error={error} notFound={error?.status === 404} onRetry={() => setRetryCount((count) => count + 1)} />
        </>
      ) : (
        <div className="two-column-layout">
          <article className="panel job-details">
            <h1>{job.title}</h1>
            <p className="job-employer">{companyName(job)}</p>
            <dl className="job-facts">
              <div><dt>Location</dt><dd>{job.location || 'Not specified'}</dd></div>
              <div><dt>Job type</dt><dd>{job.job_type || 'Not specified'}</dd></div>
              {salary && <div><dt>Salary</dt><dd>{salary}<span className="salary-note">Currency and pay period not specified.</span></dd></div>}
              {job.industry && <div><dt>Industry</dt><dd>{job.industry}</dd></div>}
              {job.experience_level && <div><dt>Experience level</dt><dd>{job.experience_level}</dd></div>}
            </dl>
            <section className="job-detail-section" aria-labelledby="description-heading">
              <h2 id="description-heading">About the role</h2>
              <p className="job-full-text">{job.description || 'A description has not been provided for this job.'}</p>
            </section>
            <section className="job-detail-section" aria-labelledby="requirements-heading">
              <h2 id="requirements-heading">Requirements</h2>
              {Array.isArray(job.requirements) && job.requirements.length ? (
                <ul className="requirements-list">{job.requirements.map((requirement, index) => <li key={index}>{requirement}</li>)}</ul>
              ) : (
                <p className="job-full-text">{typeof job.requirements === 'string' && job.requirements.trim() ? job.requirements : 'Requirements have not been provided for this job.'}</p>
              )}
            </section>
          </article>
          <PlaceholderPanel title="Apply for this job">
            <p>Application submission will be available in Phase 2.</p>
            <button className="full-width" type="button" disabled>Apply Now</button>
          </PlaceholderPanel>
        </div>
      )}
    </>
  );
}
