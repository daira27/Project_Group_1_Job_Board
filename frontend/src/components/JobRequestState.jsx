export default function JobRequestState({ loading, error, onRetry, notFound = false }) {
  if (loading) {
    return <div className="panel request-state" role="status">Loading job information…</div>;
  }

  return (
    <div className="panel request-state" role="alert">
      <h2>{notFound ? 'Job not found' : 'Unable to load jobs'}</h2>
      <p>{error.message}</p>
      {!notFound && <button className="button-secondary" type="button" onClick={onRetry}>Try Again</button>}
    </div>
  );
}
