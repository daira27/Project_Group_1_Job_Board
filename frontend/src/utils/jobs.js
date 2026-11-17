export const emptyFilters = {
  q: '',
  location: '',
  job_type: '',
  salary: '',
  employer: '',
  industry: '',
  experience_level: '',
};

export function readFilters(searchParams) {
  return Object.fromEntries(
    Object.keys(emptyFilters).map((key) => [key, (searchParams.get(key) || '').trim()]),
  );
}

export function createFilterParams(filters) {
  return new URLSearchParams(
    Object.entries(filters).map(([key, value]) => [key, value.trim()]).filter(([, value]) => value),
  );
}

export function salaryNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function formatSalary(job) {
  const min = salaryNumber(job.min_salary);
  const max = salaryNumber(job.max_salary);
  const format = (value) => value.toLocaleString('en-US', { maximumFractionDigits: 2 });

  // The API mixes hourly and annual amounts without currency or period metadata.
  if (min !== null && max !== null) return min === max ? format(min) : `${format(min)} – ${format(max)}`;
  if (min !== null) return `From ${format(min)}`;
  if (max !== null) return `Up to ${format(max)}`;
  return '';
}

export function companyName(job) {
  return job.employer || job.employer_name || 'Employer not specified';
}

export function filterJobs(jobs, filters) {
  const includes = (value, query) => String(value || '').toLowerCase().includes(query.toLowerCase());
  const keywords = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
  const minimumSalary = salaryNumber(filters.salary);

  return jobs.filter((job) => {
    const text = [job.title, job.description, companyName(job), job.requirements].filter(Boolean).join(' ');
    const offeredSalary = salaryNumber(job.max_salary) ?? salaryNumber(job.min_salary);

    return keywords.every((keyword) => includes(text, keyword))
      && includes(job.location, filters.location)
      && (!filters.job_type || String(job.job_type).toLowerCase() === filters.job_type.toLowerCase())
      && includes(companyName(job), filters.employer)
      && (!filters.industry || job.industry === filters.industry)
      && (!filters.experience_level || job.experience_level === filters.experience_level)
      && (!filters.salary || (minimumSalary !== null && offeredSalary !== null && offeredSalary >= minimumSalary));
  });
}

export function filterOptions(jobs, field) {
  return [...new Set(jobs.map((job) => job[field]).filter((value) => typeof value === 'string' && value.trim()))]
    .sort((a, b) => a.localeCompare(b));
}
