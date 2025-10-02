import Link from 'next/link';

export default function NotFound() {
  // Add some debug info
  const debugInfo = {
    pathname: typeof window !== 'undefined' ? window.location.pathname : 'SSR',
    search: typeof window !== 'undefined' ? window.location.search : 'SSR',
    timestamp: new Date().toISOString(),
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
      
      <details style={{ marginTop: '20px' }}>
        <summary>Debug Info</summary>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        <p>This not-found.tsx page is being rendered</p>
        <p>Check if page.tsx exists in src/app/</p>
      </details>
    </div>
  );
}