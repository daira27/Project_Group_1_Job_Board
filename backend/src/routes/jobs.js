const express = require('express');

const router = express.Router();

const jobSelect = `
  SELECT
    jobs.id,
    jobs.title,
    jobs.description,
    jobs.location,
    jobs.job_type,
    jobs.min_salary,
    jobs.max_salary,
    jobs.created_at,
    jobs.updated_at,
    users.id AS employer_id,
    users.name AS employer_name,
    users.company_name AS employer
  FROM jobs
  JOIN users ON users.id = jobs.employer_id
`;

router.get('/search', async (req, res, next) => {
  const { title, location, job_type: jobType, salary, employer } = req.query;
  const conditions = ["jobs.status = 'open'"];
  const values = [];
  const addCondition = (sql, value) => {
    values.push(value);
    conditions.push(sql.replace('?', `$${values.length}`));
  };

  if (typeof title === 'string' && title.trim()) {
    addCondition('jobs.title ILIKE ?', `%${title.trim()}%`);
  }
  if (typeof location === 'string' && location.trim()) {
    addCondition('jobs.location ILIKE ?', `%${location.trim()}%`);
  }
  if (typeof jobType === 'string' && jobType.trim()) {
    addCondition('jobs.job_type ILIKE ?', jobType.trim());
  }
  if (typeof salary === 'string' && salary.trim()) {
    const salaryAmount = Number(salary);
    if (!Number.isFinite(salaryAmount) || salaryAmount < 0) {
      return res.status(400).json({ error: 'salary must be a non-negative number' });
    }
    addCondition('(jobs.max_salary IS NULL OR jobs.max_salary >= ?)', salaryAmount);
  }
  if (typeof employer === 'string' && employer.trim()) {
    addCondition('users.company_name ILIKE ?', `%${employer.trim()}%`);
  }

  try {
    const result = await req.app.locals.db.query(
      `${jobSelect}
       WHERE ${conditions.join(' AND ')}
       ORDER BY jobs.created_at DESC`,
      values,
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await req.app.locals.db.query(
      `${jobSelect}
       ORDER BY jobs.created_at DESC`,
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  try {
    const result = await req.app.locals.db.query(
      `${jobSelect} WHERE jobs.id = $1`,
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
