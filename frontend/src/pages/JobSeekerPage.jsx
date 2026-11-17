import { useState } from 'react';
import WorkspaceLayout from '../components/WorkspaceLayout.jsx';

export default function JobSeekerPage({ user }) {
  const [bio, setBio] = useState(user.bio || '');
  const [skills, setSkills] = useState(Array.isArray(user.skills) ? user.skills.join(', ') : user.skills || '');
  const [error, setError] = useState('');

  function saveProfile(event) {
    event.preventDefault();
    setError('Profile saving is not connected yet. Your changes have not been saved.');
  }

  return (
    <WorkspaceLayout title={user.role === 'employer' ? 'Employer workspace' : 'Job seeker workspace'} user={user}>
      <div className="page-heading">
        <h1>My profile</h1>
        <p>View your account and tell employers about yourself.</p>
      </div>
      <section className="panel" aria-labelledby="profile-heading">
        <h2 id="profile-heading">Account details</h2>
        <dl className="job-facts">
          <div><dt>Name</dt><dd>{user.name}</dd></div>
          <div><dt>Email</dt><dd>{user.email}</dd></div>
        </dl>
        <p className="field-note" id="profile-note">Profile updates are not available yet. Changes in this form will not be saved.</p>
        <form onSubmit={saveProfile} aria-describedby="profile-note">
          <fieldset>
            <legend className="visually-hidden">Edit profile</legend>
            <label htmlFor="profile-bio">Short bio</label>
            <textarea id="profile-bio" rows="4" value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Tell us a little about yourself." />
            <label htmlFor="profile-skills">Skills</label>
            <input id="profile-skills" type="text" value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="e.g. React, JavaScript, SQL" />
            <label htmlFor="profile-picture">Profile picture</label>
            <input id="profile-picture" type="file" accept="image/*" disabled aria-describedby="picture-note" />
            <p className="field-note" id="picture-note">Profile picture uploads are not available yet.</p>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit">Save Profile</button>
          </fieldset>
        </form>
      </section>
    </WorkspaceLayout>
  );
}
