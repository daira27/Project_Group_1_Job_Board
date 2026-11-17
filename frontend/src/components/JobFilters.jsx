import { filterOptions } from '../utils/jobs.js';

export default function JobFilters({ filters, jobs, onChange, onClear }) {
  const jobTypes = [...new Set(['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', ...filterOptions(jobs, 'job_type')])];
  const industries = filterOptions(jobs, 'industry');
  const experienceLevels = filterOptions(jobs, 'experience_level');

  return (
    <aside className="panel job-filters" aria-labelledby="filters-heading">
      <div className="filters-heading">
        <h2 id="filters-heading">Filters</h2>
        <button className="text-button" type="button" onClick={onClear}>Clear Filters</button>
      </div>
      <div className="filter-field">
        <label htmlFor="job-type">Job type</label>
        <select id="job-type" value={filters.job_type} onChange={(event) => onChange('job_type', event.target.value)}>
          <option value="">All job types</option>
          {jobTypes.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      <div className="filter-field">
        <label htmlFor="salary">Minimum salary</label>
        <input id="salary" type="number" min="0" step="any" inputMode="decimal" placeholder="Any amount" value={filters.salary} onChange={(event) => onChange('salary', event.target.value)} aria-describedby="salary-note" />
        <p className="field-note" id="salary-note">Matches an offered amount at or above this value. Currency and pay period are not provided.</p>
      </div>
      <div className="filter-field">
        <label htmlFor="employer">Employer</label>
        <input id="employer" type="search" placeholder="Company name" value={filters.employer} onChange={(event) => onChange('employer', event.target.value)} />
      </div>
      <div className="filter-field">
        <label htmlFor="industry">Industry</label>
        <select id="industry" value={filters.industry} disabled={!industries.length} onChange={(event) => onChange('industry', event.target.value)} aria-describedby={!industries.length ? 'industry-note' : undefined}>
          <option value="">All industries</option>
          {industries.map((industry) => <option key={industry} value={industry}>{industry}</option>)}
        </select>
        {!industries.length && <p className="field-note" id="industry-note">Industry information is not provided by the current job data.</p>}
      </div>
      <div className="filter-field">
        <label htmlFor="experience-level">Experience level</label>
        <select id="experience-level" value={filters.experience_level} disabled={!experienceLevels.length} onChange={(event) => onChange('experience_level', event.target.value)} aria-describedby={!experienceLevels.length ? 'experience-note' : undefined}>
          <option value="">All experience levels</option>
          {experienceLevels.map((level) => <option key={level} value={level}>{level}</option>)}
        </select>
        {!experienceLevels.length && <p className="field-note" id="experience-note">Experience levels are not provided by the current job data.</p>}
      </div>
      <button className="button-secondary full-width" type="submit">Apply Filters</button>
    </aside>
  );
}
