import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import AppLayout from './components/AppLayout.jsx';
import JobListingsPage from './pages/JobListingsPage.jsx';
import JobDetailsPage from './pages/JobDetailsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import JobSeekerPage from './pages/JobSeekerPage.jsx';
import EmployerPage from './pages/EmployerPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  // Only a successful backend login should set this. Auth routes are not available yet.
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dashboardPath = user?.role === 'employer' ? '/employer' : '/profile';

  function logout() {
    setUser(null);
    navigate('/login');
  }

  return (
    <Routes>
      <Route element={<AppLayout user={user} onLogout={logout} />}>
        <Route index element={<JobListingsPage />} />
        <Route path="jobs/:jobId" element={<JobDetailsPage />} />
        <Route path="login" element={user ? <Navigate to={dashboardPath} replace /> : <LoginPage />} />
        <Route path="signup" element={user ? <Navigate to={dashboardPath} replace /> : <SignUpPage />} />
        <Route path="profile" element={user ? <JobSeekerPage user={user} /> : <Navigate to="/login" replace />} />
        <Route path="employer" element={
          !user ? <Navigate to="/login" replace />
            : user.role === 'employer' ? <EmployerPage user={user} />
              : <Navigate to="/profile" replace />
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
