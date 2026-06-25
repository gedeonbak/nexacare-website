// ── A2P 10DLC / TCPA consent audit ─────────────────────────────────────────────
//
// Single source of truth for the SMS consent disclosure patients agree to on the
// CarePath intake Typeforms. The carrier (Twilio/TCR) A2P reviewer compares:
//   1. The opt-in language declared in the A2P submission (R15 §3)
//   2. The verbatim checkbox text shown on the live Typeform (R15 §4)
//   3. The audit record proving WHEN / WHETHER / under WHICH disclosure each
//      patient consented (logged via the Typeform webhook → patients table)
// All three MUST match.
//
// PROVENANCE: the EN text below is Riley's R15 §4 canonical regulatory language,
// ratified 2026-06-24 (HIGH confidence on TCPA/CTIA; CONDITIONAL on Kevin Little
// ratification at the R1 first call). If Kevin's review changes the wording, bump
// CONSENT_DISCLOSURE_VERSION, add the new text below (never edit a prior version
// in place — versions are immutable so a stored version always reproduces the
// exact text a patient saw), re-sync the three Typeform checkboxes, and resubmit.
//
// EN is Riley's R15 §4 canonical and is deployed verbatim on form g2WVfC0n.
// ES/FR below are TRANSCRIBED FROM THE LIVE TYPEFORM DEPLOY (2026-06-24) so this
// source-of-truth matches what patients actually consented to. They are faithful
// paraphrases of Morgan's M21 draft (all 9 CTIA elements preserved) — pending
// Morgan's blessing of the as-deployed wording for the A2P evidence pack. The
// live Typeform is the authoritative rendered text. Version stays v2026-06-24
// per Riley (translation wording is editorial, not a regulatory change).

/**
 * Version string stamped onto every consent record at submission time. Keep it
 * identical across the Typeform checkbox, the A2P submission, and the keys below.
 */
export const CONSENT_DISCLOSURE_VERSION = 'v2026-06-24';

type Lang = 'EN' | 'ES' | 'FR';

/**
 * Immutable map of disclosure version → verbatim text per language. The carrier
 * reviewer clicks through and compares character-for-character, so whatever is
 * deployed into Typeform must equal the string here for the active version.
 *
 * Carrier-required elements (CTIA, all 9 present): brand, program purpose,
 * message frequency, "Msg & data rates may apply", STOP, HELP, Privacy Policy
 * link, Terms of Service link, and "consent is not a condition...".
 */
export const DISCLOSURE_TEXT: Record<string, Record<Lang, string>> = {
  'v2026-06-24': {
    EN: `By checking this box, I agree to receive recurring SMS messages from NexaCare Management about my clinic's CarePath wellness program, including check-in reminders, refill reminders, and program updates. Message frequency varies; up to 20 messages over 90 days. Msg & data rates may apply. Reply STOP to unsubscribe, HELP for help. Consent is not a condition of treatment or enrollment in any clinical service. View our Privacy Policy at https://www.nexacaremanagement.com/privacy-policy and Terms of Service at https://www.nexacaremanagement.com/terms-of-service.`,
    // Transcribed from the LIVE Typeform deploy (IpwsVhZw) 2026-06-24 — this is
    // the wording patients actually saw/consented to. A competent paraphrase of
    // Morgan's M21 draft (all 9 CTIA elements preserved); pending Morgan blessing
    // for the A2P evidence pack. The live Typeform remains the authoritative text.
    ES: `Al marcar esta casilla, autorizo la recepción de mensajes SMS periódicos de NexaCare Management acerca del programa CarePath de mi clínica. Los mensajes pueden incluir recordatorios, avisos de resurtido de medicamentos y actualizaciones de bienestar. La frecuencia de mensajes puede variar; hasta 20 mensajes en 90 días. Se pueden aplicar tarifas de mensajes y datos según su proveedor. Responda STOP para cancelar la suscripción o HELP para obtener ayuda en cualquier momento. Su consentimiento no es condición para recibir tratamiento ni servicios clínicos. Para más información, consulte nuestra Política de Privacidad en https://www.nexacaremanagement.com/privacy-policy y nuestros Términos de Servicio en https://www.nexacaremanagement.com/terms-of-service.`,
    // Transcribed from the LIVE Typeform deploy (UbYJjIEG) 2026-06-24 — see ES note.
    FR: `En cochant cette case, j'accepte de recevoir des SMS récurrents de NexaCare Management dans le cadre du programme de bien-être CarePath de ma clinique, y compris des messages de suivi, des rappels de renouvellement d'ordonnance et d'autres communications liées au programme. La fréquence des messages varie (jusqu'à 20 messages sur 90 jours). Des frais de messagerie et de données peuvent s'appliquer. Répondez STOP pour vous désabonner ou HELP pour obtenir de l'aide. Ce consentement n'est pas une condition requise pour un soin ou un service clinique. Consultez notre Politique de Confidentialité (https://www.nexacaremanagement.com/privacy-policy) et nos Conditions d'Utilisation (https://www.nexacaremanagement.com/terms-of-service).`,
  },
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
 * (and `field.type: 'legal'`). An explicit `true` is consent given.
 *
 * Returns:
 *   true   — patient checked an explicit consent box
 *   false  — patient declined a consent box (must not enroll)
 *   null   — no consent field present in the form (AUDIT GAP — flag it)
 */
export function extractConsent(answers: ConsentAnswerLike[]): boolean | null {
  const legal = answers.find(
    a => a.field?.type === 'legal' || (a.type === 'boolean' && a.field?.ref?.toLowerCase().includes('consent')),
  );
  if (legal && typeof legal.boolean === 'boolean') return legal.boolean;

  const anyBool = answers.find(a => a.type === 'boolean' && typeof a.boolean === 'boolean');
  if (anyBool && typeof anyBool.boolean === 'boolean') return anyBool.boolean;

  return null;
}

/** The verbatim disclosure text in force for the active version + language. */
export function currentDisclosureText(lang: Lang = 'EN'): string {
  return DISCLOSURE_TEXT[CONSENT_DISCLOSURE_VERSION]?.[lang] ?? '';
}
