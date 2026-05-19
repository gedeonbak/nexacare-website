// Production CarePath SMS schedule — GLP-1 medication adherence.
// 20 messages over ~28 weeks (196 days total).
//
// Phases:
//   Activation     (1–6):  weekly  — weeks 1–6
//   Momentum       (7–12): weekly  — weeks 7–12
//   Retention Lock (13–20): bi-weekly — weeks 13–28
//
// Usage:
//   getMessageBody(num, firstName, 'EN') → interpolated SMS string
//   nextMessageDate(currentNum, sentDate) → Date | null

export type Language = 'EN' | 'ES' | 'FR';
export type Phase = 'Activation' | 'Momentum' | 'Retention Lock';

export interface ScheduledMessage {
  number: number;
  phase: Phase;
  /** Days after the previous message was sent (0 for message 1 = enrollment day). */
  daysFromPrevious: number;
  body: Record<Language, string>;
}

const M = (
  number: number,
  phase: Phase,
  days: number,
  en: string,
  es: string,
  fr: string,
): ScheduledMessage => ({
  number,
  phase,
  daysFromPrevious: days,
  body: { EN: en, ES: es, FR: fr },
});

export const SCHEDULE: ScheduledMessage[] = [
  // ── Activation: weeks 1–6, weekly ────────────────────────────────────────
  M(1, 'Activation', 0,
    "Hi {firstName}! Welcome to NexaCare CarePath 👋 You've taken a great step toward your health goals. Reply YES to confirm you're enrolled, or STOP to opt out.",
    "¡Hola {firstName}! Bienvenido/a a NexaCare CarePath 👋 Ha dado un gran paso hacia sus metas de salud. Responda SÍ para confirmar, o STOP para cancelar.",
    "Bonjour {firstName} ! Bienvenue sur NexaCare CarePath 👋 Vous avez fait un grand pas vers vos objectifs santé. Répondez OUI pour confirmer, ou STOP pour vous désabonner.",
  ),
  M(2, 'Activation', 7,
    "Hi {firstName}! Week 1 check-in 🌟 How did your first dose go? Some nausea early on is normal — it usually eases up. Reply with how you're feeling!",
    "¡Hola {firstName}! Revisión semana 1 🌟 ¿Cómo estuvo su primera dosis? Las náuseas al inicio son normales y suelen disminuir. ¡Díganos cómo se siente!",
    "Bonjour {firstName} ! Bilan semaine 1 🌟 Comment s'est passée votre première dose ? Les nausées initiales sont normales. Dites-nous comment vous vous sentez !",
  ),
  M(3, 'Activation', 7,
    "Week 2 update, {firstName}! 💪 Smaller meals and staying hydrated help with side effects. Your body is adjusting — that's a good sign. Any questions? Reply anytime.",
    "¡Actualización semana 2, {firstName}! 💪 Comer porciones pequeñas y mantenerse hidratado/a ayuda. Su cuerpo se está adaptando — eso es buena señal. ¿Preguntas?",
    "Bilan semaine 2, {firstName} ! 💪 De petits repas et une bonne hydratation aident. Votre corps s'adapte — c'est bon signe. Des questions ? Répondez à tout moment.",
  ),
  M(4, 'Activation', 7,
    "Week 3, {firstName}! 🎯 Small changes add up fast. Noticing anything different — clothes fitting better, more energy, fewer cravings? Reply and tell us your wins!",
    "¡Semana 3, {firstName}! 🎯 Los pequeños cambios se acumulan rápido. ¿Nota algo diferente — ropa menos ajustada, más energía, menos antojos? ¡Cuéntenos sus logros!",
    "Semaine 3, {firstName} ! 🎯 Les petits changements s'accumulent vite. Vous remarquez quelque chose — vêtements moins serrés, plus d'énergie ? Partagez vos victoires !",
  ),
  M(5, 'Activation', 7,
    "One month in, {firstName}! 🏆 That's a big milestone. Consistency is key — same day, same time each week for your dose. How are you feeling today?",
    "¡Un mes en el tratamiento, {firstName}! 🏆 Eso es un gran hito. La constancia es clave — mismo día, misma hora cada semana para su dosis. ¿Cómo se siente hoy?",
    "Un mois de traitement, {firstName} ! 🏆 C'est une étape importante. La régularité est clé. Comment vous sentez-vous aujourd'hui ?",
  ),
  M(6, 'Activation', 7,
    "Week 6, {firstName} — Phase 1 complete! ✅ You've built a solid foundation. Your care team is proud of your commitment. Any concerns heading into Phase 2?",
    "¡Semana 6, {firstName} — Fase 1 completada! ✅ Ha construido una base sólida. Su equipo de salud está orgulloso de su compromiso. ¿Alguna preocupación?",
    "Semaine 6, {firstName} — Phase 1 terminée ! ✅ Vous avez bâti une base solide. Votre équipe de soins est fière de votre engagement. Des inquiétudes pour la suite ?",
  ),

  // ── Momentum: weeks 7–12, weekly ─────────────────────────────────────────
  M(7, 'Momentum', 7,
    "Phase 2 starts now, {firstName}! 🚀 You've proven you can stick with it. This phase turns good choices into lasting habits. What's one habit you've built so far?",
    "¡La Fase 2 comienza, {firstName}! 🚀 Ha demostrado que puede. Esta fase convierte buenas decisiones en hábitos duraderos. ¿Qué hábito ha construido hasta ahora?",
    "La Phase 2 commence, {firstName} ! 🚀 Vous avez prouvé que vous pouviez le faire. Cette phase transforme les bons choix en habitudes durables. Quel habitude avez-vous adopté ?",
  ),
  M(8, 'Momentum', 7,
    "Week 8, {firstName}! 📊 Your next clinic visit is coming up. Write down questions for your provider — they want to hear from you. How's your appetite these days?",
    "¡Semana 8, {firstName}! 📊 Su próxima visita clínica se acerca. Anote sus preguntas — su médico quiere escucharle. ¿Cómo está su apetito últimamente?",
    "Semaine 8, {firstName} ! 📊 Votre prochaine visite clinique approche. Notez vos questions — votre médecin veut vous entendre. Comment est votre appétit ces jours-ci ?",
  ),
  M(9, 'Momentum', 7,
    "{firstName}, week 9! 🥗 Protein and fiber help you feel full longer on this medication. Try lean protein at every meal. Reply for a quick tip list!",
    "¡{firstName}, semana 9! 🥗 La proteína y la fibra ayudan a sentirse lleno/a más tiempo. Intente incluir proteína magra en cada comida. ¡Responda para consejos rápidos!",
    "{firstName}, semaine 9 ! 🥗 Les protéines et les fibres vous aident à vous rassasier plus longtemps. Essayez-en à chaque repas. Répondez pour des conseils rapides !",
  ),
  M(10, 'Momentum', 7,
    "2.5 months in, {firstName}! 💫 Many patients notice the medication working more consistently now. Stay hydrated — 8 glasses a day. How's your energy this week?",
    "¡2.5 meses en el tratamiento, {firstName}! 💫 Muchos pacientes notan que el medicamento funciona más consistentemente. Manténgase hidratado/a. ¿Cómo está su energía?",
    "2,5 mois de traitement, {firstName} ! 💫 Beaucoup de patients remarquent que le médicament agit plus régulièrement. Restez hydraté(e). Comment est votre énergie cette semaine ?",
  ),
  M(11, 'Momentum', 7,
    "Week 11, {firstName}! 🌱 Movement doesn't have to be intense — even a 10-min walk after dinner makes a real difference. What movement have you added this week?",
    "¡Semana 11, {firstName}! 🌱 El movimiento no tiene que ser intenso — incluso 10 min de caminata después de cenar marca la diferencia. ¿Qué movimiento ha añadido esta semana?",
    "Semaine 11, {firstName} ! 🌱 L'activité n'a pas besoin d'être intense — même 10 min de marche après dîner fait une vraie différence. Quelle activité avez-vous ajoutée ?",
  ),
  M(12, 'Momentum', 7,
    "3 months in — one third of the way, {firstName}! 🎉 That's a real milestone. Your consistency is making a difference. Keep going — you've got this!",
    "¡3 meses en el programa — un tercio del camino, {firstName}! 🎉 Eso es un hito real. Su constancia está marcando la diferencia. ¡Siga adelante!",
    "3 mois dans le programme — un tiers du chemin, {firstName} ! 🎉 C'est une vraie étape. Votre constance fait une différence. Continuez — vous y arrivez !",
  ),

  // ── Retention Lock: weeks 13–28, bi-weekly ───────────────────────────────
  M(13, 'Retention Lock', 14,
    "Phase 3 begins, {firstName}! 🔒 The habits you build now stay with you for life. We'll check in every 2 weeks from here. How are you feeling today?",
    "¡Comienza la Fase 3, {firstName}! 🔒 Los hábitos que construya ahora lo acompañarán toda la vida. A partir de ahora revisaremos cada 2 semanas. ¿Cómo se siente hoy?",
    "La Phase 3 commence, {firstName} ! 🔒 Les habitudes que vous construisez maintenant vous accompagnent toute la vie. Nous ferons le point toutes les 2 semaines. Comment vous sentez-vous ?",
  ),
  M(14, 'Retention Lock', 14,
    "Week 16, {firstName}! 📈 Plateaus are normal — your body is adjusting at a deeper level. The medication is still working. Stay consistent. Questions for your clinic?",
    "¡Semana 16, {firstName}! 📈 Los estancamientos son normales — su cuerpo se ajusta a un nivel más profundo. El medicamento sigue funcionando. ¿Preguntas para su clínica?",
    "Semaine 16, {firstName} ! 📈 Les plateaux sont normaux — votre corps s'ajuste à un niveau plus profond. Le médicament fonctionne toujours. Des questions pour votre clinique ?",
  ),
  M(15, 'Retention Lock', 14,
    "{firstName}, week 18! 🧠 Sleep and stress directly affect weight loss. Even 7 hours of quality sleep makes a measurable difference. How has your sleep been lately?",
    "¡{firstName}, semana 18! 🧠 El sueño y el estrés afectan directamente la pérdida de peso. Incluso 7 horas de sueño de calidad marcan diferencia. ¿Cómo ha dormido?",
    "{firstName}, semaine 18 ! 🧠 Le sommeil et le stress affectent directement la perte de poids. Même 7h de qualité font une différence mesurable. Comment dormez-vous ?",
  ),
  M(16, 'Retention Lock', 14,
    "5 months in, {firstName}! 🌟 Over halfway through the program. Many patients feel significantly better by now. What's the biggest change you've noticed since starting?",
    "¡5 meses en el programa, {firstName}! 🌟 Ya superó la mitad. Muchos pacientes se sienten significativamente mejor. ¿Cuál es el mayor cambio que ha notado desde el inicio?",
    "5 mois dans le programme, {firstName} ! 🌟 Vous avez dépassé la moitié. Beaucoup de patients se sentent nettement mieux. Quel est le plus grand changement que vous avez remarqué ?",
  ),
  M(17, 'Retention Lock', 14,
    "Week 22, {firstName}! 💊 Consistent dosing is everything — same day, same time each week. Do you have a weekly reminder set on your phone? Reply YES or NO.",
    "¡Semana 22, {firstName}! 💊 La dosificación consistente lo es todo — mismo día, misma hora cada semana. ¿Tiene un recordatorio semanal en su teléfono? Responda SÍ o NO.",
    "Semaine 22, {firstName} ! 💊 La régularité des doses est essentielle — même jour, même heure chaque semaine. Avez-vous un rappel hebdomadaire ? Répondez OUI ou NON.",
  ),
  M(18, 'Retention Lock', 14,
    "6 months in, {firstName}! 🏆🏆 Half a year of commitment — that's extraordinary. Your care team is celebrating with you. What are you most proud of?",
    "¡6 meses de tratamiento, {firstName}! 🏆🏆 Medio año de compromiso — eso es extraordinario. Su equipo de salud lo celebra con usted. ¿De qué está más orgulloso/a?",
    "6 mois de traitement, {firstName} ! 🏆🏆 Un demi-an d'engagement — c'est extraordinaire. Votre équipe de soins célèbre avec vous. De quoi êtes-vous le plus fier/fière ?",
  ),
  M(19, 'Retention Lock', 14,
    "Week 26, {firstName}! 🎯 Almost there. Start thinking about your long-term plan with your provider — some patients continue, some transition. Talked to your clinic lately?",
    "¡Semana 26, {firstName}! 🎯 Casi llegamos. Empiece a pensar en su plan a largo plazo con su médico. ¿Ha hablado con su clínica recientemente?",
    "Semaine 26, {firstName} ! 🎯 Presque arrivé(e). Pensez à votre plan à long terme avec votre médecin. Avez-vous parlé récemment à votre clinique ?",
  ),
  M(20, 'Retention Lock', 14,
    "🎊 {firstName}, you've completed the NexaCare CarePath program! 28 weeks of dedication. Your care team is so proud. Keep everything you've learned — you've got this! 💪",
    "🎊 ¡{firstName}, completó el programa NexaCare CarePath! 28 semanas de dedicación. Su equipo de salud está muy orgulloso. ¡Siga con todo lo aprendido! 💪",
    "🎊 {firstName}, vous avez complété le programme NexaCare CarePath ! 28 semaines de dévouement. Votre équipe de soins est très fière. Gardez tout ce que vous avez appris ! 💪",
  ),
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getScheduledMessage(number: number): ScheduledMessage | null {
  return SCHEDULE.find(m => m.number === number) ?? null;
}

/** Replace {firstName} in a message body. */
export function interpolate(body: string, firstName: string): string {
  return body.replace(/\{firstName\}/g, firstName);
}

/** Get a fully interpolated SMS body for a patient. */
export function getMessageBody(
  messageNumber: number,
  firstName: string,
  language: Language = 'EN',
): string {
  const msg = getScheduledMessage(messageNumber);
  if (!msg) return '';
  const lang: Language = (['EN', 'ES', 'FR'] as Language[]).includes(language) ? language : 'EN';
  return interpolate(msg.body[lang] ?? msg.body.EN, firstName);
}

/**
 * Calculate the date the next message should be sent.
 * Returns null when the program is complete (after message 20).
 */
export function nextMessageDate(currentNum: number, sentDate: Date): Date | null {
  const next = SCHEDULE.find(m => m.number === currentNum + 1);
  if (!next) return null;
  const d = new Date(sentDate);
  d.setDate(d.getDate() + next.daysFromPrevious);
  return d;
}

// ── Reply risk analysis ───────────────────────────────────────────────────────

const OPT_OUT_EXACT = new Set([
  'stop', 'stopall', 'unsubscribe', 'cancel', 'end', 'quit',
  'opt out', 'optout', 'opt-out',
]);

const HIGH_RISK_KEYWORDS = [
  'sick', 'nausea', 'nauseous', 'vomit', 'vomiting', 'pain', 'hurt', 'hurting',
  'side effect', 'bad reaction', 'allergic', 'rash', 'swelling', 'worse',
  'terrible', 'awful', 'struggling', 'give up', 'stop taking', 'stopped taking',
  "didn't take", 'missed dose', 'missed injection', "didn't inject",
  'depressed', 'anxious', "can't do", 'too hard', 'too difficult',
];

const POSITIVE_KEYWORDS = [
  'yes', 'great', 'good', 'better', 'doing well', 'feeling great', 'feeling good',
  'thank', 'thanks', 'awesome', 'wonderful', 'amazing', 'excellent', 'fantastic',
  'love it', 'going well', 'ok', 'okay', 'fine', 'sure', 'absolutely',
];

export interface ReplyAnalysis {
  isOptOut: boolean;
  /** Delta to apply to churn_risk_score (clamped 0–10 in caller). */
  riskDelta: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export function analyzeReply(body: string): ReplyAnalysis {
  const lower = body.toLowerCase().trim();

  if (OPT_OUT_EXACT.has(lower) || /^stop\b/.test(lower)) {
    return { isOptOut: true, riskDelta: 10, sentiment: 'neutral' };
  }

  const hasHighRisk = HIGH_RISK_KEYWORDS.some(kw => lower.includes(kw));
  const hasPositive = POSITIVE_KEYWORDS.some(kw => lower.includes(kw));
  const sentiment: ReplyAnalysis['sentiment'] = hasHighRisk
    ? 'negative'
    : hasPositive ? 'positive' : 'neutral';

  return {
    isOptOut:  false,
    riskDelta: hasHighRisk ? 2 : hasPositive ? -1 : 0,
    sentiment,
  };
}

/** Map a 0–10 risk score to an escalation status. */
export function escalationFromScore(
  score: number,
): 'None' | 'Monitoring' | 'Founder Alerted' {
  if (score >= 7) return 'Founder Alerted';
  if (score >= 4) return 'Monitoring';
  return 'None';
}
