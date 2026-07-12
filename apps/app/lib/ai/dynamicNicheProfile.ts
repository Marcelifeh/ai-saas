export type DynamicNicheProfile = {
  niche: string;
  dimensions: string[];
  audience: string;
  rituals: string[];
  contradictions: string[];
  frustrations: string[];
  statusSignals: string[];
  insiderLanguage: string[];
  embarrassingTruths: string[];
  obsessions: string[];
  visualCulture: string[];
  purchaseMotives: string[];
};

type DynamicProfileJson = Partial<Omit<DynamicNicheProfile, "niche">>;

const SIGNAL_STOP_WORDS = new Set([
  "game",
  "games",
  "gamer",
  "gamers",
  "gaming",
  "app",
  "apps",
  "cozy",
  "content",
  "culture",
  "community",
  "crime",
  "fan",
  "fans",
  "people",
  "player",
  "players",
  "sarcastic",
  "thing",
  "things",
  "true",
  "video",
  "videos",
]);

function safeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function safeStringArray(value: unknown, limit = 12): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean))]
    .slice(0, limit);
}

async function callAIJson<T extends Record<string, unknown>>(prompt: string): Promise<Partial<T>> {
  const { chatCompletionSafe } = await import("./aiGateway");
  const response = await chatCompletionSafe({
    model: "gpt-4o-mini",
    temperature: 0.35,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Return only valid JSON. Do not include markdown, comments, or explanatory text.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) return {};

  try {
    return JSON.parse(content) as Partial<T>;
  } catch {
    return {};
  }
}

export async function buildDynamicNicheProfile(niche: string, audience?: string): Promise<DynamicNicheProfile> {
  const prompt = `
Analyze this t-shirt niche as a real human subculture.

NICHE:
${niche}

AUDIENCE / SUBCULTURE QUALIFIER:
${audience?.trim() || "Not supplied; infer the narrowest plausible participating audience."}

Return ONLY valid JSON:
{
  "dimensions": [],
  "audience": "",
  "rituals": [],
  "contradictions": [],
  "frustrations": [],
  "statusSignals": [],
  "insiderLanguage": [],
  "embarrassingTruths": [],
  "obsessions": [],
  "visualCulture": [],
  "purchaseMotives": []
}

Rules:
- Do not create slogans.
- Extract concrete behaviors, rituals, contradictions, pain points, status signals, insider language, embarrassing truths, obsessions, and visual culture.
- Do not use generic marketing words.
- Do not force keywords.
- Preserve every meaningful dimension in compound niches.
- Treat the niche and audience together. A phrase such as "sarcastic fans of true-crime short-form video apps" has at least three interacting dimensions: content interest, humor style, and media-consumption behavior.
- Dimensions must describe distinct behavioral or cultural axes, not synonyms for the category.
- Return at least 6 rituals and make most of them observable, repeated actions with a context, trigger, or consequence (for example, an intended five-minute scroll becoming a late night).
- Prefer consumption behavior and community rituals over pretending the wearer performs the profession or activity shown in the content.
- Humor about sensitive subject matter must target the viewer's habits, algorithms, commentary, or absurd decisions—not victims or harm.
- Return at least 6 visualCulture items. Make them concrete objects, interfaces, textures, tools, settings, or recurring visual details inferred from the rituals.
- Avoid mood-only abstractions like relaxing, comfort, aesthetic, vibes, self-care, or community unless tied to a specific action or object.
- Do not return broad interests or aesthetics by themselves. "indie games", "retro games", "comfort", "cozy lighting", and "cute setup" are too shallow unless attached to a repeated behavior.
- Every ritual, contradiction, frustration, status signal, embarrassing truth, and obsession should name an action, choice, object, mechanic, chore, collection, avoidance, or recurring decision.
- Prefer oddly specific subculture behavior over category labels.
- For rituals, ask: what do they repeatedly do that outsiders would not immediately understand?
- For contradictions, ask: what behavior makes outsiders laugh or say "why would you do that?"
- For statusSignals, ask: how do members quietly signal expertise or taste?
- For insiderLanguage, include subculture terms, mechanics, acronyms, UI words, genre labels, and phrases outsiders may not know.
- For embarrassingTruths, ask: what would members admit only to each other?
- For obsessions, ask: what do they spend too much time doing, collecting, organizing, optimizing, checking, or avoiding?
- If a field sounds like a mood board, rewrite it as a behavior.
- visualCulture must name objects and interfaces the audience actually handles or sees during those rituals; avoid legacy, decorative, or literal topic symbols unless the profile supports them. Do not use wall art, posters, skulls, blood, weapons, bodies, or crime-scene props as filler.
`;

  const json = await callAIJson<DynamicProfileJson>(prompt);

  return {
    niche,
    dimensions: safeStringArray(json.dimensions),
    audience: safeString(json.audience) || niche,
    rituals: safeStringArray(json.rituals),
    contradictions: safeStringArray(json.contradictions),
    frustrations: safeStringArray(json.frustrations),
    statusSignals: safeStringArray(json.statusSignals),
    insiderLanguage: safeStringArray(json.insiderLanguage),
    embarrassingTruths: safeStringArray(json.embarrassingTruths),
    obsessions: safeStringArray(json.obsessions),
    visualCulture: safeStringArray(json.visualCulture),
    purchaseMotives: safeStringArray(json.purchaseMotives),
  };
}

export async function generateSlogansFromDynamicProfile(
  profile: DynamicNicheProfile,
  count = 20,
): Promise<string[]> {
  const prompt = `
You are writing original t-shirt slogans from a dynamic niche profile.

NICHE:
${profile.niche}

AUDIENCE:
${profile.audience}

DIMENSIONS:
${profile.dimensions.join(", ")}

RITUALS:
${profile.rituals.join("\n")}

CONTRADICTIONS:
${profile.contradictions.join("\n")}

FRUSTRATIONS:
${profile.frustrations.join("\n")}

STATUS SIGNALS:
${profile.statusSignals.join("\n")}

INSIDER LANGUAGE:
${profile.insiderLanguage.join(", ")}

EMBARRASSING TRUTHS:
${profile.embarrassingTruths.join("\n")}

OBSESSIONS:
${profile.obsessions.join("\n")}

VISUAL CULTURE:
${profile.visualCulture.join(", ")}

PURCHASE MOTIVES:
${profile.purchaseMotives.join("\n")}

TASK:
Write ${count} original t-shirt slogans.

Rules:
- Do NOT use reusable slogan templates.
- Do NOT use "Just One More", "Powered By", "Mode", "Energy", "Vibes", "Love Language", "Official", "Addict", "Warrior", "MVP", "Hustler", "Eat Sleep Repeat".
- Do NOT write generic identity labels.
- Do NOT write category descriptions or product taglines such as "[interest], [mood]" or "[category] meets [comfort]".
- Do NOT write mood descriptions about comfort, ambience, escape, relaxation, or self-care unless the line also names a concrete niche behavior.
- Each slogan must come from a ritual, contradiction, frustration, status signal, embarrassing truth, obsession, or insider behavior in the profile.
- Express a behavior and its recognizable truth or consequence; do not merely pair the topic with an opinion.
- Do not imply the wearer performs a profession when the profile says they consume, watch, read, listen, scroll, or discuss it.
- For sensitive topics, joke about audience behavior, platform culture, implausible decisions, or bad excuses—not victims or violence.
- At least three quarters of the slogans should work without naming the niche or its broad category.
- No more than one quarter of slogans may include broad category labels from the niche such as "true crime", "crime", "murder", "sports", "fashion", "pets", or equivalent topic names.
- Before returning, discard slogans whose main meaning is only "I like this topic" or "this topic is dramatic/funny/interesting"; replace them with a line built from a ritual, repeated choice, interface, object, or social behavior.
- Strongly prefer slogans that repurpose insider language, mechanics, acronyms, or category terms into a niche-specific joke.
- Prefer concrete actions, objects, mechanics, recurring chores, and insider decisions over vibe words.
- Keep slogans short, wearable, and human.
- Prefer lived truth over cleverness.
- Return ONLY JSON:
{ "slogans": [] }
`;

  const json = await callAIJson<{ slogans?: unknown }>(prompt);
  return safeStringArray(json.slogans, count);
}

const bannedPatternLeakage = [
  /\bjust one more\b/i,
  /\bpowered by\b/i,
  /\bmode\b/i,
  /\benergy\b/i,
  /\bvibes?\b/i,
  /\blove language\b/i,
  /\bofficial\b/i,
  /\baddict\b/i,
  /\bwarrior\b/i,
  /\bmvp\b/i,
  /\bhustler\b/i,
  /\beat\s+sleep\b/i,
  /\bbuilt for\b/i,
  /\bno drama\b/i,
  /\blives matter\b/i,
];

export function rejectsPatternLeakage(slogan: string): boolean {
  return bannedPatternLeakage.some((rx) => rx.test(slogan));
}

function profileSignals(profile: DynamicNicheProfile): string[] {
  return [
    ...profile.dimensions,
    ...profile.rituals,
    ...profile.contradictions,
    ...profile.frustrations,
    ...profile.statusSignals,
    ...profile.insiderLanguage,
    ...profile.embarrassingTruths,
    ...profile.obsessions,
    ...profile.visualCulture,
    ...profile.purchaseMotives,
  ].filter(Boolean);
}

function signalWordHitCount(slogan: string, signals: string[]): number {
  const text = slogan.toLowerCase();
  return signals.filter((signal) => {
    const normalized = signal.toLowerCase().trim();
    if (!normalized) return false;
    if (text.includes(normalized)) return true;

    const words = normalized.split(/\s+/).filter((word) => word.length > 3 && !SIGNAL_STOP_WORDS.has(word));
    return words.some((word) => {
      if (text.includes(word)) return true;
      const stems = [
        word.replace(/ating$/i, ""),
        word.replace(/izing$/i, "iz"),
        word.replace(/(?:ing|tion|sion|ed|es|s)$/i, ""),
      ];
      return stems.some((stem) => stem.length > 3 && text.includes(stem));
    });
  }).length;
}

function shortSignalHitCount(slogan: string, signals: string[]): number {
  const text = slogan.toLowerCase();
  return signals.filter((signal) => {
    const words = signal.toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 2 && !SIGNAL_STOP_WORDS.has(word));
    return words.some((word) => text.includes(word));
  }).length;
}

export function passesDimensionCoverage(
  slogan: string,
  profile: DynamicNicheProfile,
): boolean {
  const broadHits = signalWordHitCount(slogan, profileSignals(profile));
  const insiderHits = shortSignalHitCount(slogan, profile.insiderLanguage);

  return broadHits >= 2 || (broadHits >= 1 && insiderHits >= 1);
}

export function dynamicSpecificityScore(slogan: string, profile: DynamicNicheProfile): number {
  const hits = signalWordHitCount(slogan, profileSignals(profile));
  return Math.min(100, hits * 22);
}

export function truthResonanceScore(slogan: string, profile: DynamicNicheProfile): number {
  const truthSignals = [
    ...profile.rituals,
    ...profile.contradictions,
    ...profile.frustrations,
    ...profile.statusSignals,
    ...profile.insiderLanguage,
    ...profile.embarrassingTruths,
    ...profile.obsessions,
  ];
  const hits = signalWordHitCount(slogan, truthSignals);
  return Math.min(100, hits * 24);
}

export function behavioralContradictionScore(slogan: string, profile: DynamicNicheProfile): number {
  const text = slogan.toLowerCase();
  const contradictionHits = signalWordHitCount(slogan, [
    ...profile.contradictions,
    ...profile.embarrassingTruths,
  ]);
  const contrastMarker = /[?,;:/]|\bbut\b|\bnot\b|\binstead\b|\bbefore\b|\blater\b|\bmore like\b|\bover\b|\bunfinished\b|\boptional\b|\bwait\b|\bwithout\b|\bavoids?\b/.test(text) ? 18 : 0;

  return Math.min(100, contradictionHits * 38 + contrastMarker);
}

export function ritualRecognitionScore(slogan: string, profile: DynamicNicheProfile): number {
  const ritualHits = signalWordHitCount(slogan, [
    ...profile.rituals,
    ...profile.obsessions,
    ...profile.statusSignals,
  ]);

  return Math.min(100, ritualHits * 30);
}

export function communityAuthenticityScore(slogan: string, profile: DynamicNicheProfile): number {
  const hits = signalWordHitCount(slogan, [
    ...profile.insiderLanguage,
    ...profile.statusSignals,
    ...profile.embarrassingTruths,
  ]);
  return Math.min(100, hits * 34 + (passesDimensionCoverage(slogan, profile) ? 18 : 0));
}

export function insiderWordplayScore(slogan: string, profile: DynamicNicheProfile): number {
  const text = slogan.toLowerCase();
  const insiderHits = shortSignalHitCount(slogan, [
    ...profile.insiderLanguage,
    ...profile.statusSignals,
    ...profile.obsessions,
  ]);
  const hasRepurposedPhrase = /\bmore like\b|\bnot just\b|\bnot\b|\bover\b|[?>]/i.test(slogan);
  const hasAcronym = /\b[A-Z]{2,5}\b/.test(slogan);
  const hasDecorOrCollectingTwist = /\bdecor|collect|display|nook|avatar|pixel|endgame|gear\b/i.test(text);

  return Math.min(
    100,
    insiderHits * 26 +
      (hasRepurposedPhrase ? 20 : 0) +
      (hasAcronym ? 18 : 0) +
      (hasDecorOrCollectingTwist ? 12 : 0),
  );
}

const genericMoodWords = [
  "comfort",
  "cozy",
  "haven",
  "escape",
  "relax",
  "relaxing",
  "relaxation",
  "self-care",
  "peaceful",
  "ambience",
  "ambient",
  "no pressure",
  "happy place",
];

const categoryDescriptionWords = [
  "modern",
  "comfort",
  "cozy",
  "chill",
  "aesthetic",
  "community",
  "frames",
];

const concreteBehaviorWords = [
  "arranging",
  "binging",
  "binge",
  "decorating",
  "checking",
  "commenting",
  "collecting",
  "scrolling",
  "sharing",
  "watching",
  "organizing",
  "sorting",
  "fishing",
  "farming",
  "crafting",
  "grinding",
  "watering",
  "building",
  "placing",
  "moving",
  "avoiding",
  "skipping",
  "quest",
  "inventory",
  "furniture",
  "farm",
  "pets",
  "villagers",
  "daily",
  "snacks",
  "pajamas",
  "algorithm",
  "comments",
  "clips",
  "watch",
  "history",
];

function broadCategoryLabelCount(slogan: string, profile: DynamicNicheProfile): number {
  const text = slogan.toLowerCase();
  const niche = profile.niche.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const words = niche
    .split(/\s+/)
    .filter((word) => word.length > 3 && !["fans", "sarcastic", "short", "form", "apps"].includes(word));
  const phraseHits = [
    "true crime",
    "short form",
    "short-form",
    "video apps",
  ].filter((phrase) => niche.includes(phrase.replace("-", " ")) && text.includes(phrase)).length;
  const wordHits = new Set(words.filter((word) => text.includes(word))).size;
  return phraseHits * 2 + wordHits;
}

function hasConcreteBehaviorEvidence(slogan: string, profile: DynamicNicheProfile): boolean {
  return ritualRecognitionScore(slogan, profile) >= 30 ||
    truthResonanceScore(slogan, profile) >= 50 ||
    concreteBehaviorWords.some((word) => slogan.toLowerCase().includes(word));
}

export function genericMoodPenalty(slogan: string, profile: DynamicNicheProfile): number {
  const text = slogan.toLowerCase();
  const moodHits = genericMoodWords.filter((word) => text.includes(word)).length;
  if (moodHits === 0) return 0;

  const truth = truthResonanceScore(slogan, profile);
  const specificity = dynamicSpecificityScore(slogan, profile);
  const truthOffset = truth >= 45 || specificity >= 50 ? 10 : 0;

  return Math.max(0, Math.min(30, moodHits * 10 - truthOffset));
}

export function categoryDescriptionPenalty(slogan: string, profile: DynamicNicheProfile): number {
  const text = slogan.toLowerCase();
  const words = text.split(/[^a-z0-9-]+/).filter(Boolean);
  const categoryHits = categoryDescriptionWords.filter((word) => text.includes(word)).length;
  if (categoryHits === 0) return 0;

  const hasListOrTaglineShape = /[,;:/+&]|\band\b|\bwith\b|\bmeets\b|\bgoals?\b/.test(text);
  const hasBehavior = concreteBehaviorWords.some((word) => text.includes(word));
  const hasTruth = truthResonanceScore(slogan, profile) >= 45 || dynamicSpecificityScore(slogan, profile) >= 50;

  let penalty = 0;
  if (hasListOrTaglineShape && !hasBehavior) penalty += 15;
  if (categoryHits >= 2 && !hasBehavior) penalty += 10;
  if (words.length <= 5 && categoryHits >= 2 && !hasTruth) penalty += 8;
  if (/\b(no toxicity allowed|no sweat|no pressure|modern comfort|cozy frames)\b/i.test(text)) penalty += 12;

  return Math.min(35, penalty);
}

export function screenshotProbabilityScore(slogan: string, profile: DynamicNicheProfile): number {
  const words = slogan.trim().split(/\s+/).filter(Boolean).length;
  const brevity = words <= 4 ? 90 : Math.max(35, 100 - words * 10);
  const tension =
    behavioralContradictionScore(slogan, profile) * 0.30 +
    ritualRecognitionScore(slogan, profile) * 0.25 +
    insiderWordplayScore(slogan, profile) * 0.25 +
    truthResonanceScore(slogan, profile) * 0.15;
  return Math.round(Math.min(100, brevity * 0.3 + tension));
}

export function wearabilityScore(slogan: string): number {
  const trimmed = slogan.trim();
  const words = trimmed.split(/\s+/).filter(Boolean).length;
  if (!trimmed || words > 8 || trimmed.length > 48) return 20;
  if (words <= 5 && trimmed.length <= 34) return 95;
  if (words <= 7 && trimmed.length <= 42) return 80;
  return 55;
}

export function scoreDynamicSlogan(
  slogan: string,
  profile: DynamicNicheProfile,
): number {
  const truth = truthResonanceScore(slogan, profile);
  const contradiction = behavioralContradictionScore(slogan, profile);
  const ritual = ritualRecognitionScore(slogan, profile);
  const insider = insiderWordplayScore(slogan, profile);
  const authenticity = communityAuthenticityScore(slogan, profile);
  const wearability = wearabilityScore(slogan);
  const specificity = dynamicSpecificityScore(slogan, profile);
  const screenshot = screenshotProbabilityScore(slogan, profile);
  const moodPenalty = genericMoodPenalty(slogan, profile);
  const categoryPenalty = categoryDescriptionPenalty(slogan, profile);

  const rawScore = Math.max(0, Math.round(
    contradiction * 0.24 +
      insider * 0.22 +
      ritual * 0.18 +
      truth * 0.14 +
      authenticity * 0.10 +
      specificity * 0.06 +
      screenshot * 0.04 +
      wearability * 0.02 -
      moodPenalty -
      categoryPenalty,
  ));

  // Keep headroom so "excellent" remains distinguishable from "perfect".
  // The weighted signals are intentionally saturating; compressing the upper
  // range prevents several capped components from turning every survivor into 100.
  const calibratedScore = Math.min(92, Math.round(12 + rawScore * 0.80));
  const broadLabelHits = broadCategoryLabelCount(slogan, profile);
  const hasBehaviorEvidence = hasConcreteBehaviorEvidence(slogan, profile);

  if (moodPenalty > 0 && contradiction < 25 && ritual < 25 && insider < 35) return Math.min(calibratedScore, 72);
  if (contradiction < 25 && ritual < 25 && insider < 35 && truth < 45) return Math.min(calibratedScore, 76);
  if (truth < 35 && authenticity < 35) return Math.min(calibratedScore, 70);
  if (truth < 45 && specificity < 50) return Math.min(calibratedScore, 80);
  if (broadLabelHits >= 3 && !hasBehaviorEvidence) return Math.min(calibratedScore, 78);
  if (broadLabelHits >= 2 && !hasBehaviorEvidence) return Math.min(calibratedScore, 82);
  if (broadLabelHits >= 3 && ritual < 30) return Math.min(calibratedScore, 84);
  if (broadLabelHits >= 2 && ritual < 30) return Math.min(calibratedScore, 87);
  return calibratedScore;
}
