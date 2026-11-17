import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import WorkspaceLayout from '../components/WorkspaceLayout.jsx';
import { getJobs, usingMockData } from '../services/jobs.js';

const emptyJob = {
  title: '',
  location: '',
  job_type: 'Full-time',
  min_salary: '',
  max_salary: '',
  description: '',
  requirements: '',
};

export default function EmployerPage({ user }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [jobForm, setJobForm] = useState({ ...emptyJob });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadJobs() {
      setLoading(true);
      setLoadError('');
      if (usingMockData) {
        setLoadError('Employer postings are not available in demo mode. Sample jobs are not linked to user accounts.');
        setLoading(false);
        return;
      }

      try {
        // The existing public API returns open jobs, including their employer ID.
        const allJobs = await getJobs({ signal: controller.signal });
        if (!controller.signal.aborted) {
          setJobs(allJobs.filter((job) => Number(job.employer_id) === Number(user.id)));
        }
      } catch (requestError) {
        if (!controller.signal.aborted) setLoadError(requestError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadJobs();
    return () => controller.abort();
  }, [user.id, retryCount]);

  function updateField(name, value) {
    setJobForm((current) => ({ ...current, [name]: value }));
  }

  function editJob(job) {
    setEditingId(job.id);
    setError('');
    setJobForm({
      title: job.title || '',
      location: job.location || '',
      job_type: job.job_type || 'Full-time',
      min_salary: job.min_salary ?? '',
      max_salary: job.max_salary ?? '',
      description: job.description || '',
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements || '',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setJobForm({ ...emptyJob });
    setError('');
  }

  function saveJob(event) {
    event.preventDefault();
    if (!jobForm.title.trim() || !jobForm.location.trim() || !jobForm.description.trim()) {
      setError('Enter a job title, location, and description.');
      return;
    }
    if (jobForm.min_salary !== '' && jobForm.max_salary !== '' && Number(jobForm.min_salary) > Number(jobForm.max_salary)) {
      setError('Maximum salary must be at least the minimum salary.');
      return;
    }
    setError(editingId
      ? 'Saving job changes is not connected yet. No posting has been updated.'
      : 'Posting jobs is not connected yet. No posting has been created.');
  }

  return (
    <WorkspaceLayout title="Employer workspace" user={user}>
      <div className="page-heading">
        <h1>Employer dashboard</h1>
        <p>Manage your job postings and find your next teammate.</p>
      </div>
      <p className="field-note">Job creation, saving, and deletion are not connected yet. You can prepare a draft, but changes will not be saved.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="two-column-layout">
        <section className="panel" aria-labelledby="my-jobs-heading">
          <h2 id="my-jobs-heading">My open jobs</h2>
          <p className="field-note">Only public open postings can be loaded currently. Closed and filled postings require an employer jobs API.</p>
          {loading ? <p role="status">Loading your jobs…</p> : loadError ? (
            <div role="alert">
              <p>{loadError}</p>
              {!usingMockData && <button className="button-secondary" type="button" onClick={() => setRetryCount((count) => count + 1)}>Try Again</button>}
            </div>
          ) : jobs.length === 0 ? (
            <p>No public open postings were found for your account.</p>
          ) : (
            <ul className="employer-jobs">
              {jobs.map((job) => (
                <li key={job.id}>
                  <h3>{job.title}</h3>
                  <p className="job-meta">{job.location} &middot; {job.job_type}</p>
                  <div className="form-actions">
                    <Link to={`/jobs/${job.id}`}>View job</Link>
                    <button className="button-secondary" type="button" onClick={() => editJob(job)}>Edit</button>
                    <button className="button-secondary" type="button" onClick={() => setError('Deleting jobs is not connected yet. No posting has been deleted.')}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="job-detail-section">
            <h2>Applications</h2>
            <p>Applicant lists and application status updates are not available yet.</p>
          </div>
        </section>
        <section className="panel" aria-labelledby="job-form-heading">
          <h2 id="job-form-heading">{editingId ? 'Edit job' : 'Post a job'}</h2>
          <form onSubmit={saveJob}>
            <fieldset>
              <legend className="visually-hidden">Job posting details</legend>
              <label htmlFor="posting-title">Job title</label>
              <input id="posting-title" type="text" required maxLength="160" value={jobForm.title} onChange={(event) => updateField('title', event.target.value)} />
              <label htmlFor="posting-location">Location</label>
              <input id="posting-location" type="text" required maxLength="160" placeholder="City, state, or remote" value={jobForm.location} onChange={(event) => updateField('location', event.target.value)} />
              <label htmlFor="posting-type">Job type</label>
              <select id="posting-type" value={jobForm.job_type} onChange={(event) => updateField('job_type', event.target.value)}>
                {['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'].map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
              <div className="form-row">
                <div>
                  <label htmlFor="posting-min-salary">Minimum salary</label>
                  <input id="posting-min-salary" type="number" min="0" step="0.01" value={jobForm.min_salary} onChange={(event) => updateField('min_salary', event.target.value)} />
                </div>
                <div>
                  <label htmlFor="posting-max-salary">Maximum salary</label>
                  <input id="posting-max-salary" type="number" min="0" step="0.01" value={jobForm.max_salary} onChange={(event) => updateField('max_salary', event.target.value)} />
                </div>
              </div>
              <label htmlFor="posting-description">Description</label>
              <textarea id="posting-description" required rows="5" value={jobForm.description} onChange={(event) => updateField('description', event.target.value)} />
              <label htmlFor="posting-requirements">Requirements</label>
              <textarea id="posting-requirements" rows="4" value={jobForm.requirements} onChange={(event) => updateField('requirements', event.target.value)} />
              <div className="form-actions">
                <button type="submit">{editingId ? 'Save Changes' : 'Post Job'}</button>
                {editingId && <button className="button-secondary" type="button" onClick={cancelEdit}>Cancel Edit</button>}
              </div>
            </fieldset>
          </form>
        </section>
      </div>
    </WorkspaceLayout>
  );
}
