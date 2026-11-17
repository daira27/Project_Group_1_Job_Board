import { useState } from 'react';
import { Link } from 'react-router';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('applicant');
  const [error, setError] = useState('');

  function signup(event) {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Enter your name, email, and password.');
      return;
    }
    setError('Signup is not connected yet. No account has been created.');
  }

  return (
    <div className="auth-page">
      <div className="page-heading">
        <h1>Create an account</h1>
        <p>Take the next step as a job seeker or employer.</p>
      </div>
      <section className="panel" aria-labelledby="signup-heading">
        <h2 id="signup-heading">Join Online Job Portal</h2>
        <p className="field-note" id="signup-note">Registration is not available yet. This form will not create an account.</p>
        <form aria-describedby="signup-note" onSubmit={signup}>
          <fieldset>
            <legend className="visually-hidden">Account details</legend>
            <label htmlFor="signup-role">I am a</label>
            <select id="signup-role" value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="applicant">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
            <label htmlFor="signup-name">Full name</label>
            <input id="signup-name" type="text" autoComplete="name" placeholder="Your full name" required value={name} onChange={(event) => setName(event.target.value)} />
            <label htmlFor="signup-email">Email address</label>
            <input id="signup-email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="full-width" type="submit">Create Account</button>
          </fieldset>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Login &rarr;</Link></p>
      </section>
    </div>
  );
}
