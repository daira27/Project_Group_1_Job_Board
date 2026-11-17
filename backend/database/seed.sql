INSERT INTO users (name, email, role, company_name) VALUES
  ('Maya Chen', 'maya.chen@northstar.example', 'employer', 'Northstar Analytics'),
  ('Jordan Rivera', 'jordan.rivera@greenfield.example', 'employer', 'Greenfield Labs'),
  ('Avery Patel', 'avery.patel@brightpath.example', 'employer', 'BrightPath Education')
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name,
    role = EXCLUDED.role,
    company_name = EXCLUDED.company_name;

INSERT INTO jobs (
  employer_id, title, description, location, job_type, min_salary, max_salary, status
)
SELECT employer.id, job.title, job.description, job.location, job.job_type,
       job.min_salary, job.max_salary, job.status
FROM (VALUES
  ('maya.chen@northstar.example', 'Junior Data Analyst',
   'Support product and operations teams by preparing reports, validating datasets, and communicating useful trends.',
   'Seattle, WA', 'Full-time', 65000.00, 82000.00, 'open'),
  ('maya.chen@northstar.example', 'Data Science Intern',
   'Work with analysts to explore customer data, build simple models, and present findings to the team.',
   'Seattle, WA', 'Internship', 24.00, 30.00, 'open'),
  ('jordan.rivera@greenfield.example', 'Frontend Developer',
   'Build accessible web experiences with the product team and collaborate on reliable, maintainable UI components.',
   'Remote - US', 'Full-time', 80000.00, 110000.00, 'open'),
  ('jordan.rivera@greenfield.example', 'Quality Assurance Assistant',
   'Help test web application releases, document reproducible issues, and improve the team’s test checklists.',
   'Portland, OR', 'Part-time', 28.00, 36.00, 'open'),
  ('avery.patel@brightpath.example', 'Software Engineering Co-op',
   'Contribute to education software features while learning code review, testing, and iterative development practices.',
   'Boston, MA', 'Internship', 30.00, 38.00, 'open'),
  ('avery.patel@brightpath.example', 'Technical Support Specialist',
   'Assist school partners with product questions and work with engineering to route and clarify technical issues.',
   'Boston, MA', 'Contract', 55000.00, 70000.00, 'closed')
) AS job(email, title, description, location, job_type, min_salary, max_salary, status)
JOIN users AS employer ON employer.email = job.email
WHERE NOT EXISTS (
  SELECT 1 FROM jobs existing
  WHERE existing.employer_id = employer.id AND existing.title = job.title
);
