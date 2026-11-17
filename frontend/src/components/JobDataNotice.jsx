import { usingMockData } from '../services/jobs.js';

export default function JobDataNotice() {
  if (!usingMockData) return null;

  return (
    <p className="data-notice" role="note">
      <strong>Demo mode:</strong> These are temporary sample jobs for frontend review. No live job data is being shown.
    </p>
  );
}
