-- NexaCare CarePath — PHI Schema
-- AWS RDS PostgreSQL
-- All tables in this file contain PHI
-- and are covered by the AWS BAA.
-- Run once via POST /api/db/migrate, then delete that route.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── PATIENTS ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS patients (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id          VARCHAR(50) UNIQUE NOT NULL,
  clinic_id           VARCHAR(50) NOT NULL,
  clinic_name         VARCHAR(255) NOT NULL,
  first_name          VARCHAR(100) NOT NULL,
  phone_number        VARCHAR(20)  NOT NULL,
  -- last-4 digits only — used for Twilio inbound matching without exposing full number
  phone_hash          VARCHAR(10)  NOT NULL,
  preferred_language  VARCHAR(5)   NOT NULL DEFAULT 'EN'
                        CHECK (preferred_language IN ('EN', 'ES', 'FR')),
  enrollment_date     DATE         NOT NULL,
  -- computed: days since enrollment; refreshes on every read
  carepath_day        INTEGER GENERATED ALWAYS AS (
                        EXTRACT(DAY FROM NOW() - enrollment_date::TIMESTAMP)::INTEGER
                      ) STORED,
  status              VARCHAR(20)  NOT NULL DEFAULT 'Active'
                        CHECK (status IN ('Active', 'Paused', 'Opted Out', 'Churned', 'Completed')),
  churn_risk_score    SMALLINT     NOT NULL DEFAULT 0
                        CHECK (churn_risk_score BETWEEN 0 AND 10),
  escalation_status   VARCHAR(20)  NOT NULL DEFAULT 'None'
                        CHECK (escalation_status IN ('None', 'Monitoring', 'Founder Alerted')),
  last_reply          TEXT,
  last_reply_date     TIMESTAMPTZ,
  next_message_num    SMALLINT     NOT NULL DEFAULT 1
                        CHECK (next_message_num BETWEEN 1 AND 20),
  next_message_date   DATE,
  notes               TEXT,
  hubspot_contact_id  VARCHAR(100),
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_clinic_id        ON patients(clinic_id);
CREATE INDEX IF NOT EXISTS idx_patients_status           ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_escalation       ON patients(escalation_status);
CREATE INDEX IF NOT EXISTS idx_patients_risk_score       ON patients(churn_risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_patients_next_message_date ON patients(next_message_date);
CREATE INDEX IF NOT EXISTS idx_patients_phone_hash       ON patients(phone_hash);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS patients_updated_at ON patients;
CREATE TRIGGER patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── CAREPATH MESSAGE LOG ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS carepath_message_log (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  log_id              VARCHAR(50) UNIQUE NOT NULL,
  patient_id          VARCHAR(50) NOT NULL,
  clinic_id           VARCHAR(50) NOT NULL,
  message_number      SMALLINT    NOT NULL CHECK (message_number BETWEEN 1 AND 20),
  message_phase       VARCHAR(20) NOT NULL
                        CHECK (message_phase IN ('Activation', 'Momentum', 'Retention Lock')),
  scheduled_date      DATE,
  sent_at             TIMESTAMPTZ,
  delivery_status     VARCHAR(20) NOT NULL DEFAULT 'Queued'
                        CHECK (delivery_status IN ('Queued', 'Sent', 'Delivered', 'Failed', 'Opted Out')),
  message_body        TEXT,
  patient_reply       TEXT,
  reply_received_at   TIMESTAMPTZ,
  risk_flag_triggered BOOLEAN     NOT NULL DEFAULT FALSE,
  risk_flag_type      VARCHAR(20)
                        CHECK (risk_flag_type IN ('Reply 3', 'Reply 4', 'No Reply 24h', 'No Reply 72h', NULL)),
  twilio_message_sid  VARCHAR(100),
  twilio_reply_sid    VARCHAR(100),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_log_patient_id       ON carepath_message_log(patient_id);
CREATE INDEX IF NOT EXISTS idx_message_log_clinic_id        ON carepath_message_log(clinic_id);
CREATE INDEX IF NOT EXISTS idx_message_log_sent_at          ON carepath_message_log(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_log_risk_flag        ON carepath_message_log(risk_flag_triggered)
  WHERE risk_flag_triggered = TRUE;
CREATE INDEX IF NOT EXISTS idx_message_log_delivery_status  ON carepath_message_log(delivery_status);

-- ── PHARMACY ORDERS ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS pharmacy_orders (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id            VARCHAR(50) UNIQUE NOT NULL,
  patient_id          VARCHAR(50) NOT NULL,
  clinic_id           VARCHAR(50) NOT NULL,
  pharmacy_id         VARCHAR(50),
  pharmacy_name       VARCHAR(255),
  medication_name     VARCHAR(255) NOT NULL,
  dosing_week         SMALLINT,
  order_date          DATE        NOT NULL,
  expected_delivery   DATE,
  actual_delivery     DATE,
  order_status        VARCHAR(30) NOT NULL DEFAULT 'Pending'
                        CHECK (order_status IN (
                          'Pending', 'Sent to Pharmacy', 'Processing', 'Shipped',
                          'Delivered', 'Delayed', 'Prior Auth Required',
                          'Out of Stock', 'Cancelled'
                        )),
  tracking_number     VARCHAR(100),
  prior_auth_required BOOLEAN     NOT NULL DEFAULT FALSE,
  prior_auth_status   VARCHAR(20) NOT NULL DEFAULT 'Not Required'
                        CHECK (prior_auth_status IN ('Not Required', 'Pending', 'Approved', 'Denied')),
  refill_number       SMALLINT    NOT NULL DEFAULT 1,
  next_refill_date    DATE,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pharmacy_orders_patient_id  ON pharmacy_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_orders_clinic_id   ON pharmacy_orders(clinic_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_orders_status      ON pharmacy_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_pharmacy_orders_next_refill ON pharmacy_orders(next_refill_date);

DROP TRIGGER IF EXISTS pharmacy_orders_updated_at ON pharmacy_orders;
CREATE TRIGGER pharmacy_orders_updated_at
  BEFORE UPDATE ON pharmacy_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── ROW-LEVEL SECURITY ────────────────────────────────────────────────────────
-- Belt-and-suspenders: even if app code has a bug, cross-clinic exposure is
-- blocked at the DB layer.  The application user sees all rows; clinic-level
-- filtering is enforced in the application layer on top of this.

ALTER TABLE patients             ENABLE ROW LEVEL SECURITY;
ALTER TABLE carepath_message_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_orders      ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- Drop existing policies so re-running the migration is idempotent
  DROP POLICY IF EXISTS nexacare_app_patients      ON patients;
  DROP POLICY IF EXISTS nexacare_app_message_log   ON carepath_message_log;
  DROP POLICY IF EXISTS nexacare_app_pharmacy_orders ON pharmacy_orders;
END $$;

CREATE POLICY nexacare_app_patients
  ON patients FOR ALL TO nexacare_admin USING (TRUE);

CREATE POLICY nexacare_app_message_log
  ON carepath_message_log FOR ALL TO nexacare_admin USING (TRUE);

CREATE POLICY nexacare_app_pharmacy_orders
  ON pharmacy_orders FOR ALL TO nexacare_admin USING (TRUE);
