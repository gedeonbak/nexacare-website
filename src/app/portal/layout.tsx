// Portal layout shell.
// Auth redirect is handled by src/middleware.ts.
// This layout only provides the full-screen dark backdrop that hides
// the public site's Nav and Footer (which are rendered by the root layout).

export const metadata = {
  title: 'CarePath Portal — NexaCare',
  robots: 'noindex, nofollow',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Full-screen overlay that sits above the public site Nav/Footer */}
      <div style={{
        position:   'fixed',
        inset:      0,
        background: '#0f0e1a',
        zIndex:     50,
        overflowY:  'auto',
      }}>
        {children}
      </div>
    </>
  );
}
