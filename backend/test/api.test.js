const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const createApp = require('../src/app');

//HTTP routing 
async function request(t, path, query) 
{
  const calls = [];
  const database = {
    async query(...args) 
    {
      calls.push(args);
      return query(...args);
    },
  };

  const server = createApp(database).listen(0, '127.0.0.1');
  
  t.after(() => new Promise((resolve, reject) => 
  {
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));
  await once(server, 'listening');
  const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`);
  const body = await response.json();
  return { response, body, calls };
}

test('health checks the database and returns connected status', async (t) => {
  const { response, body, calls } = await request(t, '/api/health', () => ({ rows: [] }));
  assert.equal(response.status, 200);
  assert.deepEqual(body, { status: 'ok', database: 'connected' });
  assert.equal(calls[0][0], 'SELECT 1');
  assert.equal(response.headers.get('access-control-allow-origin'), '*');
});

for (const path of ['/api/jobs', '/api/jobs?limit=10']) {
  test(`${path} returns all six jobs including non-open ID 5`, async (t) => {
    const rows = Array.from({ length: 6 }, (_, index) => ({
      id: index + 1,
      title: `Job ${index + 1}`,
      status: index === 4 ? 'closed' : 'open',
    }));
    const { response, body, calls } = await request(t, path, () => ({ rows }));
    assert.equal(response.status, 200);
    assert.deepEqual(body, rows);
    assert.equal(body.length, 6);
    assert.ok(body.some((job) => job.id === 5));
    //verify that the query has no filter or cap.
    assert.doesNotMatch(calls[0][0], /\b(?:WHERE|LIMIT|OFFSET)\b/i);
    assert.match(calls[0][0], /ORDER BY jobs.created_at DESC/);
  });
}

test('search supports all filters with parameterized values', async (t) => {
  const title = "Developer' OR 1=1 --";
  const params = new URLSearchParams({ title, location: ' Remote ', job_type: 'Full-time', salary: '80000', employer: 'Example' });
  const rows = [{ id: 2, title }];
  const { response, body, calls } = await request(t, `/api/jobs/search?${params}`, () => ({ rows }));
  assert.equal(response.status, 200);
  assert.deepEqual(body, rows);
  assert.deepEqual(calls[0][1], [`%${title}%`, '%Remote%', 'Full-time', 80000, '%Example%']);
  assert.ok(!calls[0][0].includes(title));
  for (const fragment of ["jobs.status = 'open'", 'jobs.title ILIKE $1', 'jobs.location ILIKE $2', 'jobs.job_type ILIKE $3', 'jobs.max_salary >= $4', 'users.company_name ILIKE $5']) {
    assert.ok(calls[0][0].includes(fragment));
  }
});

test('search without filters returns an empty result successfully', async (t) => {
  const { response, body, calls } = await request(t, '/api/jobs/search', () => ({ rows: [] }));
  assert.equal(response.status, 200);
  assert.deepEqual(body, []);
  assert.deepEqual(calls[0][1], []);
});

for (const salary of ['-1', 'abc', 'Infinity']) 
  {
  test(`search rejects invalid salary ${salary} before querying`, async (t) => 
    {
    const { response, body, calls } = await request(t, `/api/jobs/search?salary=${salary}`, () => assert.fail('unexpected query'));
    assert.equal(response.status, 400);
    assert.deepEqual(body, { error: 'salary must be a non-negative number' });
    assert.equal(calls.length, 0);
    });
}

test('job detail returns the requested job using a query parameter', async (t) => {
  const job = { id: 7, title: 'Analyst' };
  const { response, body, calls } = await request(t, '/api/jobs/7', () => ({ rows: [job] }));
  assert.equal(response.status, 200);
  assert.deepEqual(body, job);
  assert.match(calls[0][0], /WHERE jobs.id = \$1/);
  assert.deepEqual(calls[0][1], [7]);
});

test('missing job returns 404', async (t) => {
  const { response, body } = await request(t, '/api/jobs/999', () => ({ rows: [] }));
  assert.equal(response.status, 404);
  assert.deepEqual(body, { error: 'Job not found' });
});

for (const id of ['0', '-1', '1.5', 'abc', '9007199254740992']) {
  test(`job detail rejects invalid id ${id} before querying`, async (t) => {
    const { response, body, calls } = await request(t, `/api/jobs/${id}`, () => assert.fail('unexpected query'));
    assert.equal(response.status, 400);
    assert.deepEqual(body, { error: 'id must be a positive integer' });
    assert.equal(calls.length, 0);
  });
}

for (const path of ['/api/health', '/api/jobs', '/api/jobs/search', '/api/jobs/1']) {
  test(`${path} returns a generic 500 on database failure`, async (t) => {
    const errors = [];
    t.mock.method(console, 'error', (error) => errors.push(error));
    const failure = new Error('private database connection details');
    const { response, body } = await request(t, path, () => { throw failure; });
    assert.equal(response.status, 500);
    assert.deepEqual(body, { error: 'Internal server error' });
    assert.deepEqual(errors, [failure]);
  });
}
