import { Route, Routes } from 'react-router';
import AppLayout from './components/AppLayout.jsx';
import JobListingsPage from './pages/JobListingsPage.jsx';
import JobDetailsPage from './pages/JobDetailsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import JobSeekerPage from './pages/JobSeekerPage.jsx';
import EmployerPage from './pages/EmployerPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<JobListingsPage />} />
        <Route path="jobs/:jobId" element={<JobDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="profile" element={<JobSeekerPage />} />
        <Route path="employer" element={<EmployerPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
