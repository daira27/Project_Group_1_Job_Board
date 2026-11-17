# Job Board backend

Requires Node.js 22 or newer, npm, and a running PostgreSQL server with the
`psql` and `createdb` command-line tools installed.

To run: (from the repository root):

```sh
cd backend
npm ci
cp .env.example .env
```

## Setting Up the Database

For a local PostgreSQL database, keep PGSSL=false in the .env file.

The commands below create the job_board database and set up the tables with some sample data. You only need to create the database once. Make sure to use your own PostgreSQL username and port if they're different.

createdb -h localhost -p 5432 -U postgres job_board
psql -h localhost -p 5432 -U postgres -d job_board -v ON_ERROR_STOP=1 -f database/schema.sql
psql -h localhost -p 5432 -U postgres -d job_board -v ON_ERROR_STOP=1 -f database/seed.sql
npm start

## Running the Backend

Make sure you're inside the backend folder when running npm commands so the server can read the .env file.

The backend runs on port 3000 by default, but you can change it in .env if needed.

npm run dev    # Starts the server in development mode
npm test       # Runs the backend tests

## Testing

The automated tests check that the API endpoints work as expected. This includes retrieving jobs, searching with filters, getting individual job details, handling invalid inputs, and checking database errors.

The tests use a mock database, so you don't need PostgreSQL running to execute them. However, you still need to test the actual database connection separately.

Once the server is running and connected to PostgreSQL, you can use these commands to check the endpoints:

curl --fail-with-body http://localhost:3000/api/health
curl --fail-with-body http://localhost:3000/api/jobs
curl --fail-with-body 'http://localhost:3000/api/jobs/search?title=Data&location=Seattle'
curl --fail-with-body http://localhost:3000/api/jobs/1

For the last command, you can replace 1 with any job ID that exists in the database.

If the database connection is working, the health endpoint should return:

{"status":"ok","database":"connected"}