import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import JobCard from '../components/JobCard.jsx';
import JobFilters from '../components/JobFilters.jsx';
import JobDataNotice from '../components/JobDataNotice.jsx';
import JobRequestState from '../components/JobRequestState.jsx';
import { getJobs, searchJobs } from '../services/jobs.js';
import { createFilterParams, emptyFilters, readFilters } from '../utils/jobs.js';

export default function JobListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.toString();
  const [filters, setFilters] = useState(() => readFilters(searchParams));
  const [jobs, setJobs] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const appliedFilters = readFilters(new URLSearchParams(search));
    setFilters(appliedFilters);

    async function loadJobs() {
      setLoading(true);
      setError(null);
      try {
        // Keep filter choices based on the full list, even while searching.
        const allJobs = await getJobs({ signal: controller.signal });
        if (controller.signal.aborted) return;
        setCatalog(allJobs);

        const matchingJobs = Object.values(appliedFilters).some(Boolean)
          ? await searchJobs(appliedFilters, { signal: controller.signal, fallbackJobs: allJobs })
          : allJobs;

        if (!controller.signal.aborted) setJobs(matchingJobs);
      } catch (requestError) {
        if (!controller.signal.aborted) setError(requestError);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadJobs();
    return () => controller.abort();
  }, [search, retryCount]);

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function submitSearch(event) {
    event.preventDefault();
    const nextParams = createFilterParams(filters);
    if (nextParams.toString() === search) setRetryCount((count) => count + 1);
    else setSearchParams(nextParams);
  }

  function clearFilters() {
    setFilters({ ...emptyFilters });
    setSearchParams({});
  }

  return (
    <>
      <JobDataNotice />
      <form onSubmit={submitSearch}>
        <section className="hero panel" aria-labelledby="hero-heading">
          <h1 id="hero-heading">Find Your Next Opportunity</h1>
          <p className="description">Connect with employers and discover opportunities that match your skills and interests. Take the next step in your career.</p>
          <div className="search-controls">
            <div className="search-field">
              <label htmlFor="job-search">Job title or keyword</label>
              <input type="search" id="job-search" placeholder="e.g. Frontend developer" value={filters.q} onChange={(event) => updateFilter('q', event.target.value)} />
            </div>
            <div className="search-field">
              <label htmlFor="job-location">Location</label>
              <input type="search" id="job-location" placeholder="City, state, or remote" value={filters.location} onChange={(event) => updateFilter('location', event.target.value)} />
            </div>
            <button type="submit">Search Jobs</button>
          </div>
        </section>
        <div className="jobs-layout">
          <JobFilters filters={filters} jobs={catalog} onChange={updateFilter} onClear={clearFilters} />
          <section className="job-results" aria-labelledby="results-heading" aria-busy={loading}>
            <h2 className="results-heading" id="results-heading" aria-live="polite">
              {loading ? 'Finding jobs…' : error ? 'Job listings' : `${jobs.length} ${jobs.length === 1 ? 'job' : 'jobs'} available`}
            </h2>
            {loading || error ? (
              <JobRequestState loading={loading} error={error} onRetry={() => setRetryCount((count) => count + 1)} />
            ) : jobs.length === 0 ? (
              <div className="panel request-state" role="status">
                <h3>No jobs found</h3>
                <p>Try different keywords or clear your filters to see more opportunities.</p>
                <button className="button-secondary" type="button" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="job-list">
                {jobs.map((job) => <JobCard key={job.id} job={job} search={search} />)}
              </div>
            )}
          </section>
        </div>
      </form>
    </>
  );
}
