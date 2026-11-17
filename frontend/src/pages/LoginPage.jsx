import { useState } from 'react';
import { Link } from 'react-router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function login(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    // No login request until the backend provides an authentication route.
    setError('Login is not connected yet. You have not been signed in.');
  }

  return (
    <div className="auth-page">
      <div className="page-heading">
        <h1>Your next step starts here</h1>
        <p>Log in to manage your account.</p>
      </div>
      <section className="panel" aria-labelledby="login-heading">
        <h2 id="login-heading">Welcome back</h2>
        <p className="field-note" id="login-note">Account sign-in is not available yet. This form will not sign you in.</p>
        <form aria-describedby="login-note" onSubmit={login}>
          <fieldset>
            <legend className="visually-hidden">Login details</legend>
            <label htmlFor="login-email">Email address</label>
            <input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="full-width" type="submit">Login</button>
          </fieldset>
        </form>
        <p className="auth-switch">New to Online Job Portal? <Link to="/signup">Sign Up &rarr;</Link></p>
      </section>
    </div>
  );
}
