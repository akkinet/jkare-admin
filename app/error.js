'use client'
export default function Error({ error }) {
  return (
    <div>
      <h1>{error.status}</h1>
      <p>{error.message}</p>
    </div>
  );
}