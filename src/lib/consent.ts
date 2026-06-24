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
// ES/FR are Riley's functional translations — PENDING Morgan native-speaker
// review before they go live on the ES/FR Typeforms (R15 §9).

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
    // PENDING Morgan native-speaker review (R15 §9) before ES Typeform deploy.
    ES: `Al marcar esta casilla, acepto recibir mensajes SMS recurrentes de NexaCare Management sobre el programa de bienestar CarePath de mi clínica, incluyendo recordatorios de seguimiento, recordatorios de surtido de medicamentos y actualizaciones del programa. La frecuencia de los mensajes varía; hasta 20 mensajes en 90 días. Pueden aplicarse tarifas de mensaje y datos. Responda STOP para cancelar la suscripción o HELP para obtener ayuda. El consentimiento no es una condición para recibir tratamiento ni para inscribirse en ningún servicio clínico. Consulte nuestra Política de Privacidad en https://www.nexacaremanagement.com/privacy-policy y los Términos de Servicio en https://www.nexacaremanagement.com/terms-of-service.`,
    // PENDING Morgan native-speaker review (R15 §9) before FR Typeform deploy.
    FR: `En cochant cette case, j'accepte de recevoir des messages SMS récurrents de NexaCare Management concernant le programme de bien-être CarePath de ma clinique, y compris des rappels de suivi, des rappels de renouvellement d'ordonnance et des mises à jour du programme. La fréquence des messages varie; jusqu'à 20 messages sur 90 jours. Des frais de messagerie et de données peuvent s'appliquer. Répondez STOP pour vous désabonner ou HELP pour obtenir de l'aide. Le consentement n'est pas une condition de traitement ni d'inscription à un service clinique. Consultez notre Politique de Confidentialité à https://www.nexacaremanagement.com/privacy-policy et nos Conditions d'Utilisation à https://www.nexacaremanagement.com/terms-of-service.`,
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
