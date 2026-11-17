import { Link } from 'react-router';

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="page-heading">
        <h1>Your next step starts here</h1>
        <p>Log in to manage your account.</p>
      </div>
      <section className="panel" aria-labelledby="login-heading">
        <h2 id="login-heading">Welcome back</h2>
        <p className="field-note" id="login-note">Login will be available soon.</p>
        {/* Disabled fields establish the layout without collecting credentials. */}
        <form aria-describedby="login-note" onSubmit={(event) => event.preventDefault()}>
          <fieldset disabled>
            <legend className="visually-hidden">Login details</legend>
            <label htmlFor="login-email">Email address</label>
            <input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" />
            <label htmlFor="login-password">Password</label>
            <input id="login-password" type="password" autoComplete="current-password" />
            <button className="full-width" type="submit">Login</button>
          </fieldset>
        </form>
        <p className="auth-switch">New to Online Job Portal? <Link to="/signup">Sign Up &rarr;</Link></p>
      </section>
    </div>
  );
}
