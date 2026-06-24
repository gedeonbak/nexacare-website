-- Migration: add A2P 10DLC / TCPA consent-audit columns to patients
-- Handoff:   A14 step 3 (Alex) — consent logging verification
-- Date:      2026-06-24
--
-- WHY: The A2P resubmission states that SMS consent is logged for audit. Before
-- this migration that claim was false — the patients table stored no consent
-- evidence. These columns capture WHEN (consent_at), WHETHER (consent_given),
-- under WHICH disclosure (consent_disclosure_version → src/lib/consent.ts), and
-- corroborating device/network data, plus the Typeform response token so the
-- authoritative respondent IP can be pulled from Typeform's Responses API.
--
-- The in-app migration route was removed in commit f0eef31, so apply this
-- directly against RDS:
--   psql "$DATABASE_URL" -f scripts/migrations/2026-06-24_add_consent_audit_columns.sql
--
-- Idempotent: safe to run more than once (ADD COLUMN IF NOT EXISTS).

ALTER TABLE patients
  ADD COLUMN IF NOT EXISTS consent_given              BOOLEAN,
  ADD COLUMN IF NOT EXISTS consent_at                 TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_disclosure_version VARCHAR(30),
  ADD COLUMN IF NOT EXISTS consent_ip                 VARCHAR(45),
  ADD COLUMN IF NOT EXISTS consent_user_agent         TEXT,
  ADD COLUMN IF NOT EXISTS consent_network_id         VARCHAR(100),
  ADD COLUMN IF NOT EXISTS consent_response_token     VARCHAR(100);

-- Fast lookup of consent records for audit export / reviewer evidence pulls.
CREATE INDEX IF NOT EXISTS idx_patients_consent_at ON patients(consent_at);
