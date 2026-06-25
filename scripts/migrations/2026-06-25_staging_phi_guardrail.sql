-- ============================================================================
-- N3 — STAGING PHI GUARDRAIL   ⚠️  STAGING DATABASE ONLY — NEVER RUN ON PROD  ⚠️
-- ============================================================================
-- Bypass-proof, DB-level enforcement that the staging environment can never hold
-- a real phone number (= no PHI). Per R4 §5/§6 (Riley HIPAA review, 2026-06-25).
--
-- WHY DB-LEVEL: enforcement is a BEFORE INSERT/UPDATE trigger inside the Postgres
-- engine, so the Next.js API, a direct `psql` session, node-pg-migrate
-- migrations, and seed/fixture scripts ALL traverse it equally. Nothing reaches
-- the table without passing the guard — a direct connection cannot bypass it
-- (this is the §5 question Riley flagged).
--
-- FAIL-CLOSED: a violation RAISEs an exception and aborts the transaction. There
-- is no cold-start / skip path (which an application-layer or inline-Lambda check
-- would have). Reject-by-default is structural, not configured.
--
-- ALLOW-LIST: NANP fictional subscriber range 555-0100..555-0199 (ATIS-0300049,
-- reserved for fictional use; cannot route to a real person) — and ONLY that.
-- No developer real numbers, ever (the moment one lands, staging is no longer
-- non-PHI).
--
-- ALERTING: a rejecting trigger aborts its own transaction, so an in-transaction
-- audit-table INSERT would be rolled back with it. The durable signal is instead
-- a server-log WARNING (log output is NOT transactional) carrying only the
-- last-4. CloudWatch metric filter on 'STAGING_PHI_GUARDRAIL_REJECT' → alarm →
-- #escalations (R4 §6 item 3).
--
-- SAFETY INTERLOCK: refuses to apply unless the database is explicitly flagged as
-- staging. Provision the staging RDS with:
--     ALTER DATABASE <dbname> SET app.is_staging = 'on';
-- On prod (where Anne Baraka / Ernest Ntale hold real numbers) this flag is unset,
-- so this migration aborts rather than break real enrollments.

DO $guard$
BEGIN
  IF current_setting('app.is_staging', true) IS DISTINCT FROM 'on' THEN
    RAISE EXCEPTION
      'REFUSING: the staging PHI guardrail may only be applied to a database flagged app.is_staging=on. This interlock protects production patient data.';
  END IF;
END
$guard$;

-- ── Enforcement function ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION staging_assert_fictional_phone() RETURNS trigger AS $fn$
DECLARE
  digits text;
  line7  text;
BEGIN
  IF NEW.phone_number IS NULL THEN
    RETURN NEW;                                   -- no phone, nothing to guard
  END IF;

  digits := regexp_replace(NEW.phone_number, '\D', '', 'g');         -- keep digits
  IF length(digits) = 11 AND left(digits, 1) = '1' THEN
    digits := substr(digits, 2);                                     -- drop US country code
  END IF;

  -- last 7 digits = exchange(NXX) + subscriber(XXXX); fictional = 555 + 0100..0199
  line7 := CASE WHEN length(digits) >= 7 THEN right(digits, 7) ELSE '' END;

  IF length(digits) <> 10 OR line7 < '5550100' OR line7 > '5550199' THEN
    -- durable redacted signal (survives the rollback the EXCEPTION triggers)
    RAISE WARNING 'STAGING_PHI_GUARDRAIL_REJECT table=% last4=%',
      TG_TABLE_NAME,
      CASE WHEN length(digits) >= 4 THEN right(digits, 4) ELSE '????' END;
    RAISE EXCEPTION
      'STAGING_PHI_GUARDRAIL: only NANP fictional numbers 555-0100..555-0199 are permitted in staging (got non-fictional phone, last4=%).',
      CASE WHEN length(digits) >= 4 THEN right(digits, 4) ELSE '????' END;
  END IF;

  RETURN NEW;
END
$fn$ LANGUAGE plpgsql;

-- ── Attach to every staging table holding a phone column (currently: patients) ─
DROP TRIGGER IF EXISTS staging_phi_guardrail ON patients;
CREATE TRIGGER staging_phi_guardrail
  BEFORE INSERT OR UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION staging_assert_fictional_phone();

-- If a future table gains a phone column, add a matching trigger here AND update
-- the pen-test (scripts/staging_guardrail_pentest.cjs).
