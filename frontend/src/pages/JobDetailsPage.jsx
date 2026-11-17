import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import JobDataNotice from '../components/JobDataNotice.jsx';
import JobRequestState from '../components/JobRequestState.jsx';
import { getJob } from '../services/jobs.js';
import { companyName, formatSalary } from '../utils/jobs.js';

export default function JobDetailsPage({ user }) {
  const { jobId } = useParams();
  const { search } = useLocation();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showApplication, setShowApplication] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applicationError, setApplicationError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setShowApplication(false);
    setCoverLetter('');
    setApplicationError('');

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

  function submitApplication(event) {
    event.preventDefault();
    if (user?.role !== 'applicant') {
      setApplicationError('Sign in as a job seeker before applying.');
      return;
    }
    // The backend has no application submission route yet.
    setApplicationError('Application submission is not connected yet. No application has been sent.');
  }

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
          <section className="panel" aria-labelledby="apply-heading">
            <h2 id="apply-heading">Apply for this job</h2>
            {!user ? (
              <p><Link to="/login">Log in</Link> or <Link to="/signup">sign up</Link> as a job seeker to apply.</p>
            ) : user.role !== 'applicant' ? (
              <p>Only job seekers can apply for jobs.</p>
            ) : (
              <p className="field-note">Applying as {user.name} &middot; {user.email}</p>
            )}
            <p className="field-note" id="application-note">Application submission is not available yet. This form will not send an application.</p>
            <button className="full-width" type="button" disabled={Boolean(user && user.role !== 'applicant')} aria-expanded={showApplication} aria-controls="application-form" onClick={() => setShowApplication(!showApplication)}>
              {showApplication ? 'Cancel Application' : 'Apply Now'}
            </button>
            {showApplication && (
              <form className="application-form" id="application-form" aria-describedby="application-note" onSubmit={submitApplication}>
                <fieldset disabled={!user || user.role !== 'applicant'}>
                  <legend className="visually-hidden">Application for {job.title}</legend>
                  <label htmlFor="application-resume">Resume</label>
                  <input id="application-resume" type="file" disabled aria-describedby="resume-note" />
                  <p className="field-note" id="resume-note">Resume uploads are not supported yet.</p>
                  <label htmlFor="application-cover-letter">Cover letter (optional)</label>
                  <textarea id="application-cover-letter" name="cover_letter" rows="6" value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} placeholder="Tell the employer why you are interested in this role." />
                  {applicationError && <p className="form-error" role="alert">{applicationError}</p>}
                  <button className="full-width" type="submit">Submit Application</button>
                </fieldset>
              </form>
            )}
            {user?.role === 'applicant' && <p className="field-note"><Link to="/dashboard">View my applications</Link></p>}
          </section>
        </div>
      )}
    </>
  );
}
