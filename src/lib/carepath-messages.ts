export type Language = "en" | "es" | "fr";
export type Phase = 1 | 2 | 3;

export interface SimulatedReply {
  text: string;
  automated?: Record<Language, string>;
}

export interface StatusMessage {
  text: string;
  type: "success" | "warning" | "info";
}

export interface CarePathMessage {
  id: number;
  day: number;
  phase: Phase;
  text: Record<Language, string>;
  reply?: SimulatedReply;
  statusMessage?: StatusMessage;
  explanation: string;
}

export const MESSAGES: CarePathMessage[] = [
  // ─── PHASE 1 — ACTIVATION (Days 1–14) ───────────────────────────────────────
  {
    id: 1,
    day: 1,
    phase: 1,
    text: {
      en: `Hi {firstName}! Welcome to {clinicName}'s GLP-1 program, powered by CarePath 👋\n\nOver the next 90 days I'll check in weekly to track your progress. Responding — even a quick "1" — helps your care team serve you better.\n\nReply STOP at any time to opt out.\n\nHere's to Day 1! 🌟`,
      es: `¡Hola {firstName}! Bienvenido/a al programa GLP-1 de {clinicName}, impulsado por CarePath 👋\n\nDurante los próximos 90 días haré seguimiento semanal de tu progreso. Responder — incluso un rápido "1" — ayuda a tu equipo médico.\n\nResponde STOP para cancelar.\n\n¡Por el Día 1! 🌟`,
      fr: `Bonjour {firstName}! Bienvenue dans le programme GLP-1 de {clinicName}, propulsé par CarePath 👋\n\nPendant les 90 prochains jours, je ferai le point hebdomadaire. Répondre — même un rapide "1" — aide votre équipe soignante.\n\nRépondez STOP pour vous désabonner.\n\nVive le Jour 1! 🌟`,
    },
    explanation:
      "Day 1 welcome sets expectations and establishes the communication channel. Research shows patients who receive a structured welcome message are 34% more likely to complete the program.",
  },
  {
    id: 2,
    day: 3,
    phase: 1,
    text: {
      en: `Day 3 check-in from {clinicName} 👋\n\nHow are you feeling so far? Reply with a number:\n\n1 — Feeling great, no issues\n2 — Some mild side effects\n3 — Not feeling well / have questions\n\nYour provider reviews all responses. There's no wrong answer.`,
      es: `Check-in del Día 3 de {clinicName} 👋\n\n¿Cómo te has sentido hasta ahora? Responde con un número:\n\n1 — Muy bien, sin problemas\n2 — Algunos efectos secundarios leves\n3 — No me siento bien / tengo preguntas\n\nTu proveedor revisa todas las respuestas.`,
      fr: `Check-in du Jour 3 de {clinicName} 👋\n\nComment vous sentez-vous jusqu'à présent? Répondez avec un chiffre:\n\n1 — Très bien, aucun problème\n2 — Quelques effets secondaires légers\n3 — Je ne me sens pas bien / j'ai des questions\n\nVotre médecin examine toutes les réponses.`,
    },
    reply: { text: "1" },
    statusMessage: { text: "✓ Positive response logged", type: "success" },
    explanation:
      "Day 3 check-in catches early side effects before they become dropout reasons. The simple 1/2/3 reply system removes friction — lower effort equals higher response rates.",
  },
  {
    id: 3,
    day: 5,
    phase: 1,
    text: {
      en: `Quick note from {clinicName} CarePath 📋\n\nMild nausea or reduced appetite in Week 1 is completely normal with GLP-1 medications. Three tips:\n\n• Eat smaller, slower meals\n• Stay hydrated — aim for 64oz daily\n• Avoid fatty or spicy foods this week\n\nIf symptoms feel severe, contact your clinic directly.`,
      es: `Nota rápida de {clinicName} CarePath 📋\n\nNáuseas leves o apetito reducido en la Semana 1 es completamente normal con GLP-1. Tres consejos:\n\n• Come porciones más pequeñas y más despacio\n• Mantente hidratado/a — apunta a 64oz diarios\n• Evita comidas grasosas o picantes esta semana\n\nSi los síntomas son severos, contacta tu clínica directamente.`,
      fr: `Note rapide de {clinicName} CarePath 📋\n\nDes nausées légères ou un appétit réduit en Semaine 1 sont tout à fait normaux avec les médicaments GLP-1. Trois conseils:\n\n• Mangez des repas plus petits et plus lentement\n• Restez hydraté(e) — visez 2 litres par jour\n• Évitez les aliments gras ou épicés cette semaine\n\nSi les symptômes sont sévères, contactez votre clinique directement.`,
    },
    explanation:
      "Education messages in the first two weeks address the most common reasons for early dropout: side effects, unrealistic expectations, and poor nutritional habits. Proactive education reduces silent churn — patients who stop without telling the clinic.",
  },
  {
    id: 4,
    day: 7,
    phase: 1,
    text: {
      en: `Week 1 nutrition tip from {clinicName} 🥗\n\nProtein is your best friend on GLP-1. Aim for 80–100g daily to protect muscle while losing fat.\n\nBest sources: eggs, Greek yogurt, chicken, fish, cottage cheese.\n\nSmall, protein-rich meals will help you feel better AND see faster results. Keep going, {firstName}!`,
      es: `Consejo nutricional Semana 1 de {clinicName} 🥗\n\nLa proteína es tu mejor aliada con GLP-1. Apunta a 80–100g diarios para proteger músculo mientras pierdes grasa.\n\nMejores fuentes: huevos, yogur griego, pollo, pescado, requesón.\n\n¡Comidas pequeñas y ricas en proteínas te harán sentir mejor. ¡Sigue adelante, {firstName}!`,
      fr: `Conseil nutrition Semaine 1 de {clinicName} 🥗\n\nLes protéines sont vos meilleures alliées avec GLP-1. Visez 80–100g par jour pour préserver le muscle tout en perdant de la graisse.\n\nMeilleures sources: œufs, yaourt grec, poulet, poisson, fromage blanc.\n\nContinuez comme ça, {firstName}!`,
    },
    explanation:
      "Education messages in the first two weeks address the most common reasons for early dropout: side effects, unrealistic expectations, and poor nutritional habits.",
  },
  {
    id: 5,
    day: 10,
    phase: 1,
    text: {
      en: `Day 10 — you're building momentum! 💪\n\nFrom {clinicName}: Three habits that predict GLP-1 success:\n\n✓ Taking medication at the same time daily\n✓ Logging meals (even rough estimates count)\n✓ Responding to these check-ins\n\nYou're already doing #3. That alone puts you ahead of 40% of new patients.`,
      es: `¡Día 10 — estás construyendo impulso! 💪\n\nDe {clinicName}: Tres hábitos que predicen el éxito con GLP-1:\n\n✓ Tomar la medicación a la misma hora diariamente\n✓ Registrar comidas (incluso estimados aproximados)\n✓ Responder a estos check-ins\n\n¡Ya estás haciendo el #3!`,
      fr: `Jour 10 — vous prenez de l'élan! 💪\n\nDe {clinicName}: Trois habitudes qui prédisent le succès avec GLP-1:\n\n✓ Prendre le médicament à la même heure chaque jour\n✓ Noter les repas (même approximativement)\n✓ Répondre à ces check-ins\n\nVous faites déjà le #3!`,
    },
    explanation:
      "Education messages in the first two weeks address the most common reasons for early dropout: side effects, unrealistic expectations, and poor nutritional habits.",
  },
  {
    id: 6,
    day: 14,
    phase: 1,
    text: {
      en: `🎉 Two weeks in, {firstName}!\n\n{clinicName} here. You've made it through the hardest part — most patients who reach Day 14 complete the full 90-day program.\n\nYour body is adapting and the results are coming.\n\nReply YES to confirm you're still on track!`,
      es: `🎉 ¡Dos semanas, {firstName}!\n\n{clinicName} aquí. Has superado la parte más difícil — la mayoría de pacientes que llegan al Día 14 completan el programa de 90 días.\n\nTu cuerpo se está adaptando y los resultados están llegando.\n\n¡Responde SÍ para confirmar que vas bien!`,
      fr: `🎉 Deux semaines, {firstName}!\n\n{clinicName} ici. Vous avez passé la partie la plus difficile — la plupart des patients qui atteignent le Jour 14 terminent le programme complet de 90 jours.\n\nVotre corps s'adapte et les résultats arrivent.\n\nRépondez OUI pour confirmer que vous êtes sur la bonne voie!`,
    },
    reply: { text: "YES" },
    statusMessage: { text: "✓ Week 2 milestone confirmed", type: "success" },
    explanation:
      "Week 2 milestone framing uses social proof and progress anchoring. Patients who receive milestone messages show 28% higher Week 4 retention. The YES reply also confirms the channel is working correctly.",
  },

  // ─── PHASE 2 — MOMENTUM (Days 15–60) ────────────────────────────────────────
  {
    id: 7,
    day: 21,
    phase: 2,
    text: {
      en: `Day 21 check-in from {clinicName} CarePath!\n\nPlease rate each 1–5:\n\n• Energy level this week\n  (1 = very low · 5 = excellent)\n• Appetite control\n  (1 = struggling · 5 = great)\n• Overall satisfaction with program\n  (1 = low · 5 = high)\n\nReply with 3 numbers: e.g. 4 3 5`,
      es: `¡Check-in del Día 21 de {clinicName} CarePath!\n\nCalifica cada uno del 1 al 5:\n\n• Nivel de energía esta semana\n  (1 = muy bajo · 5 = excelente)\n• Control del apetito\n  (1 = con dificultades · 5 = genial)\n• Satisfacción general con el programa\n  (1 = baja · 5 = alta)\n\nResponde con 3 números: ej. 4 3 5`,
      fr: `Check-in du Jour 21 de {clinicName} CarePath!\n\nÉvaluez chacun de 1 à 5:\n\n• Niveau d'énergie cette semaine\n  (1 = très bas · 5 = excellent)\n• Contrôle de l'appétit\n  (1 = difficile · 5 = très bien)\n• Satisfaction globale avec le programme\n  (1 = faible · 5 = élevée)\n\nRépondez avec 3 chiffres: ex. 4 3 5`,
    },
    reply: { text: "4 4 3" },
    statusMessage: { text: "✓ 3-point data logged · Scores above threshold", type: "success" },
    explanation:
      "Weekly momentum check-ins capture three data points per patient. Declining scores trigger automated support escalation. The 3-number format collects energy, appetite, and satisfaction without overwhelming patients.",
  },
  {
    id: 8,
    day: 28,
    phase: 2,
    text: {
      en: `One month down, {firstName}! 🗓️\n\nFrom {clinicName}: You're 33% through your program. Patients who reach Day 28 typically see their most significant results in the next 30 days as the medication reaches full effectiveness.\n\nStay consistent — the compound effect is real.`,
      es: `¡Un mes completado, {firstName}! 🗓️\n\nDe {clinicName}: Estás al 33% del programa. Los pacientes que llegan al Día 28 suelen ver los cambios más significativos en los próximos 30 días a medida que la medicación alcanza su plena efectividad.\n\nMantén la constancia.`,
      fr: `Un mois accompli, {firstName}! 🗓️\n\nDe {clinicName}: Vous avez complété 33% du programme. Les patients qui atteignent le Jour 28 voient généralement leurs résultats les plus significatifs dans les 30 prochains jours.\n\nRestez constant(e) — l'effet composé est réel.`,
    },
    explanation:
      "Weekly momentum check-ins capture three data points per patient. Declining scores trigger automated support escalation.",
  },
  {
    id: 9,
    day: 35,
    phase: 2,
    text: {
      en: `Day 35 check-in from {clinicName}! 💬\n\nQuick 3-number update:\n\n• Energy level (1–5)\n• Appetite control (1–5)\n• Confidence in continuing (1–5)\n\nReply with 3 numbers: e.g. 4 4 5\n\nNote: a confidence score of 1–2 automatically triggers a personal outreach from your care team.`,
      es: `¡Check-in del Día 35 de {clinicName}! 💬\n\nActualización rápida con 3 números:\n\n• Nivel de energía (1–5)\n• Control del apetito (1–5)\n• Confianza en continuar (1–5)\n\nResponde con 3 números: ej. 4 4 5\n\nNota: una puntuación de confianza de 1–2 activa automáticamente un contacto personal de tu equipo médico.`,
      fr: `Check-in du Jour 35 de {clinicName}! 💬\n\nMise à jour rapide avec 3 chiffres:\n\n• Niveau d'énergie (1–5)\n• Contrôle de l'appétit (1–5)\n• Confiance pour continuer (1–5)\n\nRépondez avec 3 chiffres: ex. 4 4 5\n\nNote: un score de confiance de 1–2 déclenche automatiquement un contact personnel de votre équipe soignante.`,
    },
    explanation:
      "Weekly momentum check-ins capture three data points per patient. Declining scores trigger automated support escalation.",
  },
  {
    id: 10,
    day: 42,
    phase: 2,
    text: {
      en: `Plateau alert from {clinicName} CarePath 📊\n\nWeek 6 is when many patients experience a temporary slowdown. This is completely normal and expected with GLP-1 medications.\n\nYour body is recalibrating — this is NOT a sign the medication isn't working.\n\nPatients who push through Week 6 see an average of 12% more total weight loss. You've got this, {firstName}.`,
      es: `Alerta de meseta de {clinicName} CarePath 📊\n\nLa Semana 6 es cuando muchos pacientes experimentan una desaceleración temporal. Esto es completamente normal y esperado con los medicamentos GLP-1.\n\nTu cuerpo está recalibrando — NO es señal de que el medicamento no funcione.\n\nLos pacientes que superan la Semana 6 ven un 12% más de pérdida de peso total. Tú puedes, {firstName}.`,
      fr: `Alerte plateau de {clinicName} CarePath 📊\n\nLa Semaine 6 est souvent marquée par un ralentissement temporaire. C'est tout à fait normal et attendu avec les médicaments GLP-1.\n\nVotre corps se réétalonne — ce n'est PAS un signe que le médicament ne fonctionne pas.\n\nLes patients qui passent la Semaine 6 voient en moyenne 12% de perte de poids en plus. Vous pouvez le faire, {firstName}.`,
    },
    explanation:
      "The plateau message is the single highest-value message in the sequence. Week 6 is the peak dropout moment — this message directly addresses the cause before the patient acts on it.",
  },
  {
    id: 11,
    day: 49,
    phase: 2,
    text: {
      en: `Week 7 check-in from {clinicName}!\n\nOne question: how confident are you that you'll complete the full 90-day program?\n\n1 = Not confident at all\n2 = Somewhat uncertain\n3 = Neutral\n4 = Fairly confident\n5 = Very confident\n\nReply with a single number. Low scores automatically notify your care team.`,
      es: `¡Check-in Semana 7 de {clinicName}!\n\nUna pregunta: ¿qué tan confiado/a estás de completar el programa de 90 días?\n\n1 = Nada confiado/a\n2 = Algo inseguro/a\n3 = Neutral\n4 = Bastante confiado/a\n5 = Muy confiado/a\n\nResponde con un solo número.`,
      fr: `Check-in Semaine 7 de {clinicName}!\n\nUne question: dans quelle mesure êtes-vous confiant(e) de terminer le programme de 90 jours?\n\n1 = Pas du tout confiant(e)\n2 = Un peu incertain(e)\n3 = Neutre\n4 = Assez confiant(e)\n5 = Très confiant(e)\n\nRépondez avec un seul chiffre.`,
    },
    reply: {
      text: "3",
      automated: {
        en: `Thanks for your honesty, {firstName}. Your {clinicName} care team has been notified and will reach out within 24 hours.\n\nA score of 3 at Week 7 is common — most patients who flag uncertainty here still complete the program. You're not alone in this. 💙`,
        es: `Gracias por tu honestidad, {firstName}. Tu equipo de {clinicName} ha sido notificado y se pondrá en contacto en 24 horas.\n\nUna puntuación de 3 en la Semana 7 es común — la mayoría de los pacientes que señalan incertidumbre aquí aún completan el programa. No estás solo/a en esto. 💙`,
        fr: `Merci pour votre honnêteté, {firstName}. Votre équipe {clinicName} a été notifiée et vous contactera dans les 24 heures.\n\nUn score de 3 à la Semaine 7 est courant — la plupart des patients qui signalent une incertitude ici terminent quand même le programme. Vous n'êtes pas seul(e). 💙`,
      },
    },
    statusMessage: {
      text: "⚠ Risk trigger activated · Support message queued · Clinic notified within 24hrs",
      type: "warning",
    },
    explanation:
      "Confidence scoring at Week 7 gives a 3-week warning before Day 90. Low confidence = renewal risk = intervention window. The automated response fires immediately; human outreach follows within 24 hours.",
  },
  {
    id: 12,
    day: 56,
    phase: 2,
    text: {
      en: `🎉 Two months, {firstName}!\n\n{clinicName} checking in — you've completed 62% of your CarePath program.\n\nTwo-month completers see an average of 8–15% total body weight reduction by Day 90. You're in the group most likely to hit that milestone.\n\nYour next message begins the renewal conversation — no pressure, just planning ahead.`,
      es: `🎉 ¡Dos meses, {firstName}!\n\n{clinicName} aquí — has completado el 62% de tu programa CarePath.\n\nLos que completan dos meses ven una reducción promedio del 8–15% de peso corporal al Día 90. Estás en el grupo con más probabilidad de alcanzar ese hito.\n\nTu próximo mensaje comienza la conversación de renovación.`,
      fr: `🎉 Deux mois, {firstName}!\n\n{clinicName} ici — vous avez complété 62% de votre programme CarePath.\n\nLes patients qui atteignent deux mois voient une réduction moyenne de 8–15% du poids corporel d'ici le Jour 90. Vous faites partie du groupe le plus susceptible d'atteindre cet objectif.\n\nVotre prochain message commencera la conversation de renouvellement.`,
    },
    explanation:
      "Confidence scoring at Week 7 gives a 3-week warning before Day 90. Low confidence = renewal risk = intervention window.",
  },

  // ─── PHASE 3 — RETENTION LOCK (Days 61–90) ──────────────────────────────────
  {
    id: 13,
    day: 63,
    phase: 3,
    text: {
      en: `Heads up from {clinicName}: Your 90-day program ends in 27 days.\n\nWe're not asking you to decide anything yet — just making sure you have time to think through whether continuing makes sense for your goals.\n\nReply PLAN and we'll send continuation options before Day 80. No obligation.`,
      es: `Aviso de {clinicName}: Tu programa de 90 días termina en 27 días.\n\nNo te pedimos que decidas nada todavía — solo nos aseguramos de que tengas tiempo para pensar si continuar tiene sentido para tus objetivos.\n\nResponde PLAN para recibir opciones de continuación. Sin compromiso.`,
      fr: `Avertissement de {clinicName}: Votre programme de 90 jours se termine dans 27 jours.\n\nNous ne vous demandons pas de décider maintenant — nous voulons juste vous donner le temps de réfléchir si continuer est judicieux pour vos objectifs.\n\nRépondez PLAN pour recevoir les options de continuation. Sans obligation.`,
    },
    explanation:
      "Retention Lock phase begins renewal priming 27 days before Day 90. Research shows renewal decisions are made 3–4 weeks before the end date — not at Day 90 when it's already too late.",
  },
  {
    id: 14,
    day: 70,
    phase: 3,
    text: {
      en: `Day 70 from {clinicName} CarePath! You're in the final stretch.\n\nQuick check: are you still taking your medication as prescribed?\n\nReply YES or NO — this helps your care team ensure your supply is on track for your final weeks and any renewal period.`,
      es: `¡Día 70 de {clinicName} CarePath! Estás en la recta final.\n\nVerificación rápida: ¿sigues tomando tu medicación según lo recetado?\n\nResponde SÍ o NO — esto ayuda a tu equipo médico a asegurarse de que tu suministro esté al día para tus últimas semanas.`,
      fr: `Jour 70 de {clinicName} CarePath! Vous êtes dans la dernière ligne droite.\n\nVérification rapide: prenez-vous toujours votre médicament comme prescrit?\n\nRépondez OUI ou NON — cela aide votre équipe soignante à s'assurer que votre approvisionnement est en bonne voie.`,
    },
    reply: { text: "YES" },
    statusMessage: { text: "✓ Medication adherence confirmed · Renewal signal positive", type: "success" },
    explanation:
      "Retention Lock phase continues. Medication adherence at Day 70 is a strong predictor of Day 90 renewal. This check also prevents avoidable supply gaps in the final weeks.",
  },
  {
    id: 15,
    day: 77,
    phase: 3,
    text: {
      en: `Day 77 — 13 days to go, {firstName}!\n\n{clinicName} wants you to know: patients who complete the full 90-day CarePath sequence show 3.2× better 6-month outcomes than those who stop early.\n\nYou're almost there. Your Day 84 milestone message is coming. Keep going.`,
      es: `¡Día 77 — quedan 13 días, {firstName}!\n\n{clinicName} quiere que sepas: los pacientes que completan los 90 días de CarePath muestran resultados 3.2× mejores a los 6 meses que quienes se detienen antes.\n\nCasi llegas. Tu mensaje del Día 84 está por venir.`,
      fr: `Jour 77 — encore 13 jours, {firstName}!\n\n{clinicName} veut que vous sachiez: les patients qui terminent les 90 jours de CarePath montrent des résultats 3.2× meilleurs à 6 mois que ceux qui s'arrêtent tôt.\n\nVous y êtes presque. Votre message du Jour 84 arrive.`,
    },
    explanation:
      "Retention Lock phase continues building toward renewal. The reference to the Day 84 milestone creates anticipation and keeps patients engaged through the final stretch.",
  },
  {
    id: 16,
    day: 84,
    phase: 3,
    text: {
      en: `🏆 Day 84, {firstName}!\n\nYou've completed 93% of your {clinicName} GLP-1 program — putting you in the top tier of program completers.\n\nThe metabolic changes happening in these final days are the ones that stick long-term.\n\nSix more days. You've earned this.`,
      es: `🏆 ¡Día 84, {firstName}!\n\nHas completado el 93% de tu programa GLP-1 de {clinicName} — estás en el nivel más alto de completadores del programa.\n\nLos cambios metabólicos que ocurren en estos últimos días son los que perduran a largo plazo.\n\nSeis días más. Te lo has ganado.`,
      fr: `🏆 Jour 84, {firstName}!\n\nVous avez complété 93% de votre programme GLP-1 de {clinicName} — vous faites partie du groupe supérieur de ceux qui terminent.\n\nLes changements métaboliques qui se produisent dans ces derniers jours sont ceux qui perdurent à long terme.\n\nEncore six jours. Vous l'avez mérité.`,
    },
    explanation:
      "Final compliance check and milestone celebration. Patients who receive a Day 84 milestone message show significantly higher renewal rates than those who don't.",
  },
  {
    id: 17,
    day: 85,
    phase: 3,
    text: {
      en: `Final week reminder from {clinicName}: Make sure you have enough medication to complete your last 5 days.\n\nIf you're running low, contact the clinic now — don't skip doses in the final week.\n\nConsistent dosing in Week 13 directly affects your Day 90 results. You're so close, {firstName}!`,
      es: `Recordatorio de última semana de {clinicName}: Asegúrate de tener suficiente medicación para completar los últimos 5 días.\n\nSi te estás quedando sin medicación, contacta la clínica ahora — no omitas dosis en la última semana.\n\n¡Estás tan cerca, {firstName}!`,
      fr: `Rappel de dernière semaine de {clinicName}: Assurez-vous d'avoir assez de médicament pour vos 5 derniers jours.\n\nSi vous en manquez, contactez la clinique maintenant — ne sautez pas de doses la dernière semaine.\n\nVous y êtes presque, {firstName}!`,
    },
    explanation:
      "Final compliance check and milestone celebration. Medication supply check prevents avoidable dropout in the final week — a critical and entirely preventable form of churn.",
  },
  {
    id: 18,
    day: 87,
    phase: 3,
    text: {
      en: `Almost there, {firstName}!\n\nQuick note from {clinicName}: The Day 90 conversation is coming — it's just a check-in, no pressure.\n\nWe'll ask how you feel about your results and what continuation looks like for you. Whatever you decide, your {clinicName} team wants you to succeed long-term.`,
      es: `¡Ya casi, {firstName}!\n\nNota rápida de {clinicName}: La conversación del Día 90 se acerca — es solo un check-in, sin presión.\n\nPreguntaremos cómo te sientes respecto a tus resultados y qué significa la continuación para ti.`,
      fr: `Presque là, {firstName}!\n\nNote rapide de {clinicName}: La conversation du Jour 90 approche — c'est juste un check-in, sans pression.\n\nNous vous demanderons comment vous vous sentez par rapport à vos résultats et ce que la continuation représente pour vous.`,
    },
    explanation:
      "Priming the patient for the Day 90 conversation reduces anxiety and increases YES rates. Patients who know what's coming are more likely to engage than those who feel blindsided.",
  },
  {
    id: 19,
    day: 88,
    phase: 3,
    text: {
      en: `Day 88 — 2 days left in your {clinicName} program, {firstName}!\n\nAre you interested in continuing your GLP-1 program beyond Day 90?\n\nReply YES — interested in continuing\nReply UNSURE — I'd like to talk first\nReply NO — planning to wrap up\n\nAny answer helps us serve you better.`,
      es: `¡Día 88 — quedan 2 días en tu programa de {clinicName}, {firstName}!\n\n¿Estás interesado/a en continuar tu programa GLP-1 más allá del Día 90?\n\nResponde SÍ — interesado/a en continuar\nResponde INSEGURO/A — me gustaría hablar primero\nResponde NO — planeando terminar`,
      fr: `Jour 88 — 2 jours restants dans votre programme {clinicName}, {firstName}!\n\nÊtes-vous intéressé(e) à continuer votre programme GLP-1 au-delà du Jour 90?\n\nRépondez OUI — intéressé(e) à continuer\nRépondez INCERTAIN(E) — j'aimerais parler d'abord\nRépondez NON — je prévois de terminer`,
    },
    reply: { text: "YES" },
    statusMessage: { text: "✓ Renewal intent confirmed · Handoff to clinic team scheduled", type: "success" },
    explanation:
      "Day 88 renewal intent capture — the most important data point in the sequence. UNSURE or NO replies trigger a human checkpoint before the Day 90 message is sent.",
  },
  {
    id: 20,
    day: 90,
    phase: 3,
    text: {
      en: `🎉 Day 90, {firstName}!\n\nCongratulations on completing your {clinicName} GLP-1 program.\n\nWhatever happens next — you did the hard part.\n\nYour clinic team will reach out personally within 48 hours to discuss your results and next steps.\n\nThank you for trusting {clinicName}. 💙`,
      es: `🎉 ¡Día 90, {firstName}!\n\n¡Felicitaciones por completar tu programa GLP-1 de {clinicName}!\n\nPase lo que pase después — hiciste la parte difícil.\n\nTu equipo de la clínica se comunicará contigo personalmente en 48 horas para discutir tus resultados.\n\nGracias por confiar en {clinicName}. 💙`,
      fr: `🎉 Jour 90, {firstName}!\n\nFélicitations pour avoir complété votre programme GLP-1 de {clinicName}!\n\nQuoi qu'il arrive ensuite — vous avez fait la partie difficile.\n\nVotre équipe clinique vous contactera personnellement dans les 48 heures pour discuter de vos résultats.\n\nMerci de faire confiance à {clinicName}. 💙`,
    },
    statusMessage: { text: "✓ Program complete · Patient retained", type: "success" },
    explanation:
      "Day 90 close is positive regardless of renewal outcome. Maintains the clinic relationship and leaves the door open for return patients. The personal follow-up within 48 hours closes the loop.",
  },
];
