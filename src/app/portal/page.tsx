// /portal — Real clinic coordinator portal (server component)
//
// Middleware (src/middleware.ts) guarantees a cookie exists before this runs.
// This page does the FULL HMAC verification (Node.js crypto) and redirects
// to /portal/login if the token is forged or expired.

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyPortalSession, type PortalSessionPayload } from '@/lib/session';
import { getPatientsByClinic } from '@/lib/patients';
import type { Patient } from '@/lib/patients';
import PortalShell from './PortalShell';

export const dynamic = 'force-dynamic';

export default async function PortalPage() {
  const jar   = await cookies();
  const token = jar.get('nxc_portal_session')?.value ?? '';
  const session: PortalSessionPayload | null = verifyPortalSession(token);

  // Full HMAC check — redirect if token is missing, forged, or expired
  if (!session) {
    redirect('/portal/login?error=invalid');
  }

  // Fetch patients from RDS for this clinic only
  const patients: Patient[] = await getPatientsByClinic(session.clinicId);

  // Compute stats server-side (avoids passing raw numbers to client)
  const active      = patients.filter(p => p.status === 'Active').length;
  const total       = patients.length;
  const escalations = patients.filter(
    p => p.escalation_status !== 'None' && p.status === 'Active',
  ).length;
  const optedOut    = patients.filter(p => p.status === 'Opted Out').length;
  const avgRisk     = active > 0
    ? Math.round(
        patients
          .filter(p => p.status === 'Active')
          .reduce((sum, p) => sum + p.churn_risk_score, 0) / active,
      )
    : 0;

  return (
    <PortalShell
      clinicId={session.clinicId}
      clinicName={session.clinicName}
      patients={patients}
      stats={{ active, total, escalations, optedOut, avgRisk }}
    />
  );
}
