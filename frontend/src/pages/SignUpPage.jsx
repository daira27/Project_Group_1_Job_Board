import { Link } from 'react-router';

export default function SignUpPage() {
  return (
    <div className="auth-page">
      <div className="page-heading">
        <h1>Create an account</h1>
        <p>Take the next step as a job seeker or employer.</p>
      </div>
      <section className="panel" aria-labelledby="signup-heading">
        <h2 id="signup-heading">Join Online Job Portal</h2>
        <p className="field-note" id="signup-note">Registration will be available soon.</p>
        <form aria-describedby="signup-note" onSubmit={(event) => event.preventDefault()}>
          <fieldset disabled>
            <legend className="visually-hidden">Account details</legend>
            <label htmlFor="signup-role">I am a</label>
            <select id="signup-role" defaultValue="job-seeker">
              <option value="job-seeker">Job seeker</option>
              <option value="employer">Employer</option>
            </select>
            <label htmlFor="signup-name">Full name</label>
            <input id="signup-name" type="text" autoComplete="name" placeholder="Your full name" />
            <label htmlFor="signup-email">Email address</label>
            <input id="signup-email" type="email" autoComplete="email" placeholder="you@example.com" />
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" autoComplete="new-password" />
            <button className="full-width" type="submit">Create Account</button>
          </fieldset>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login &rarr;</Link></p>
      </section>
    </div>
  );
}
