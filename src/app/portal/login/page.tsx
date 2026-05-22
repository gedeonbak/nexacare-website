// /portal/login
//
// Two entry paths:
//   1. ?key=UUID  → handled server-side: immediately redirects to /api/portal/auth?key=...
//   2. No key     → renders LoginClient (email lookup UI)
//
// Error codes forwarded to LoginClient via ?error= query param:
//   invalid      — key was rejected
//   missing_key  — key param present but empty

import { redirect } from 'next/navigation';
import LoginClient from './LoginClient';

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function PortalLoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const key    = params.key?.trim() ?? '';
  const error  = params.error ?? '';

  // If a key is present, hand off to the auth API route.
  // That route does the Airtable lookup, sets the cookie, and redirects.
  if (key) {
    redirect(`/api/portal/auth?key=${encodeURIComponent(key)}`);
  }

  return <LoginClient errorCode={error} />;
}
