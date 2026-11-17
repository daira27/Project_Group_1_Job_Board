import { mockJobs } from '../data/mockJobs.js';
import { filterJobs } from '../utils/jobs.js';

const apiBase = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
export const usingMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export class JobApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'JobApiError';
    this.status = status;
  }
}

async function request(path, signal) {
  let response;
  try {
    response = await fetch(`${apiBase}${path}`, { signal, headers: { Accept: 'application/json' } });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new JobApiError('Unable to reach the job service. Please try again shortly.');
  }

  if (!response.ok) {
    throw new JobApiError(
      'Unable to load jobs. Please try again shortly.',
      response.status,
    );
  }

  try {
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new JobApiError('The job service returned an unreadable response. Please try again.');
  }
}

function checkJob(job) {
  return job && Number.isSafeInteger(Number(job.id)) && Number(job.id) > 0 && typeof job.title === 'string';
}

function checkJobs(jobs) {
  if (!Array.isArray(jobs) || !jobs.every(checkJob)) {
    throw new JobApiError('The job service returned an unexpected response. Please try again.');
  }
  return jobs;
}

export async function getJobs({ signal } = {}) {
  signal?.throwIfAborted();
  if (usingMockData) return mockJobs;
  return checkJobs(await request('/jobs', signal));
}

export async function searchJobs(filters, { signal, fallbackJobs } = {}) {
  signal?.throwIfAborted();
  if (usingMockData) return filterJobs(mockJobs, filters);

  // The API's title filter ignores descriptions. Match broader keywords locally.
  const params = new URLSearchParams();
  for (const key of ['location', 'job_type', 'salary', 'employer']) {
    if (filters[key]) params.set(key, filters[key]);
  }

  let jobs;
  try {
    const query = params.toString();
    jobs = checkJobs(await request(`/jobs/search${query ? `?${query}` : ''}`, signal));
  } catch (error) {
    // Support a backend deployment that has listings but no search route yet.
    if (![404, 405].includes(error.status)) throw error;
    jobs = fallbackJobs ?? await getJobs({ signal });
  }
  return filterJobs(jobs, filters);
}

export async function getJob(jobId, { signal } = {}) {
  signal?.throwIfAborted();
  if (!/^\d+$/.test(jobId) || !Number.isSafeInteger(Number(jobId)) || Number(jobId) < 1) {
    throw new JobApiError('This job could not be found. Check the link and try again.', 404);
  }

  let job;
  if (usingMockData) {
    job = mockJobs.find((item) => item.id === Number(jobId));
  } else {
    try {
      job = await request(`/jobs/${encodeURIComponent(jobId)}`, signal);
    } catch (error) {
      if (error.status === 404) throw new JobApiError('This job could not be found. It may have been removed.', 404);
      throw error;
    }
  }

  if (usingMockData && !job) throw new JobApiError('This demo job could not be found.', 404);
  if (!checkJob(job)) throw new JobApiError('The job service returned an unexpected response. Please try again.');
  return job;
}
