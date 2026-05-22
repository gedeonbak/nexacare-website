// Admin section shell layout.
//
// Auth fast-path: middleware (src/middleware.ts) blocks requests with no cookie.
// Full HMAC verification happens per-page in server components, or at the API
// level for all write operations. This layout is a simple dark-theme wrapper.

export const metadata = {
  title: 'NexaCare Admin',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0f0e1a', color: 'rgba(255,255,255,0.85)' }}>
      {children}
    </div>
  );
}
