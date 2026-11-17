CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'applicant'
    CHECK (role IN ('applicant', 'employer', 'admin')),
  company_name VARCHAR(160),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (role <> 'employer' OR company_name IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  employer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(160) NOT NULL,
  job_type VARCHAR(30) NOT NULL
    CHECK (job_type IN ('Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary')),
  min_salary NUMERIC(12, 2) CHECK (min_salary IS NULL OR min_salary >= 0),
  max_salary NUMERIC(12, 2)
    CHECK (max_salary IS NULL OR (max_salary >= 0 AND
      (min_salary IS NULL OR max_salary >= min_salary))),
  status VARCHAR(20) NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'closed', 'filled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'reviewing', 'accepted', 'rejected')),
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (job_id, applicant_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS jobs_status_created_at_idx ON jobs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS jobs_employer_id_idx ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS applications_applicant_id_idx ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS notifications_user_id_created_at_idx
  ON notifications(user_id, created_at DESC);
