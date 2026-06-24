// ── A2P 10DLC / TCPA consent audit ─────────────────────────────────────────────
//
// This module is the single source of truth for the SMS consent disclosure that
// patients agree to on the CarePath intake Typeforms. The carrier (Twilio/TCR)
// A2P reviewer compares three things during campaign review:
//   1. The opt-in language declared in the A2P submission (drafted in R15)
//   2. The verbatim checkbox text shown on the live Typeform
//   3. The audit record proving WHEN / WHETHER / under WHICH disclosure each
//      patient consented
//
// All three MUST match. When the disclosure text changes, bump
// CONSENT_DISCLOSURE_VERSION, add the new verbatim text to DISCLOSURE_TEXT, and
// re-sync the Typeform checkbox + the A2P submission. Never edit an existing
// version's text in place — versions are immutable so a stored
// `consent_disclosure_version` always reproduces the exact text a patient saw.
//
// HANDOFF: A14 (Alex) ⇄ R15 (Riley). The text below is PROVISIONAL — it must be
// replaced verbatim with Riley's R15-ratified, TCPA-precise language before the
// A2P resubmission (A14 step 4). Until then, treat `2026.1-draft` as not yet
// carrier-submittable.

/**
 * Version string stamped onto every consent record at submission time.
 * BUMP THIS whenever the disclosure copy changes, and keep it identical across
 * the Typeform checkbox, the A2P submission, and DISCLOSURE_TEXT below.
 */
export const CONSENT_DISCLOSURE_VERSION = '2026.1-draft';

/**
 * Immutable map of disclosure version → verbatim text shown to the patient.
 * Keep prior versions forever. The `2026.1-draft` body MUST be overwritten with
 * Riley's R15 final language (and the version renamed to e.g. `2026.1`) before
 * the A2P campaign is resubmitted.
 *
 * Carrier-required elements (CTIA): brand name, program purpose, message
 * frequency, "Msg & data rates may apply", STOP, HELP, Privacy Policy link,
 * Terms of Service link, and "consent is not a condition of treatment".
 */
export const DISCLOSURE_TEXT: Record<string, string> = {
  '2026.1-draft':
    'I agree to receive recurring automated text messages from NexaCare ' +
    'Management about my clinic’s CarePath wellness program (up to 20 messages ' +
    'over 90 days). Msg & data rates may apply. Reply STOP to opt out, HELP for ' +
    'help. Consent is not a condition of treatment or purchase. See our Privacy ' +
    'Policy (nexacaremanagement.com/privacy-policy) and Terms of Service ' +
    '(nexacaremanagement.com/terms-of-service).',
};

// ── Typeform payload shapes relevant to consent ────────────────────────────────

export interface TypeformConsentMetadata {
  user_agent?: string;
  platform?: string;
  referer?: string;
  /** Typeform-assigned network identifier (NOT a raw IP). */
  network_id?: string;
  browser?: string;
}

/** Minimal answer shape needed to read the consent (Legal/boolean) field. */
interface ConsentAnswerLike {
  type: string;
  boolean?: boolean;
  field?: { type?: string; ref?: string };
}

/**
 * Extract the affirmative-consent value from a Typeform response.
 *
 * Typeform's "Legal" question type returns an answer with `type: 'boolean'`
 * (and `field.type: 'legal'`). We treat an explicit `true` as consent given.
 *
 * Returns:
 *   true   — patient checked an explicit consent box
 *   false  — patient declined a consent box (should never enroll)
 *   null   — no consent field present in the form (AUDIT GAP — flag it)
 */
export function extractConsent(answers: ConsentAnswerLike[]): boolean | null {
  // Prefer a field explicitly typed as 'legal' (Typeform consent checkbox).
  const legal = answers.find(
    a => a.field?.type === 'legal' || (a.type === 'boolean' && a.field?.ref?.toLowerCase().includes('consent')),
  );
  if (legal && typeof legal.boolean === 'boolean') return legal.boolean;

  // Fallback: any boolean answer at all.
  const anyBool = answers.find(a => a.type === 'boolean' && typeof a.boolean === 'boolean');
  if (anyBool && typeof anyBool.boolean === 'boolean') return anyBool.boolean;

  return null;
}

/** The verbatim disclosure text currently in force (for the active version). */
export function currentDisclosureText(): string {
  return DISCLOSURE_TEXT[CONSENT_DISCLOSURE_VERSION] ?? '';
}
