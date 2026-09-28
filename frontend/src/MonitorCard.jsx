function MonitorCard({ name, url, status }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>URL: {url}</p>
      <p>Status: {status}</p>
    </div>
  );
}

export default MonitorCard;
