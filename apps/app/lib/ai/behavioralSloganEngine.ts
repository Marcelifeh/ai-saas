import { BehavioralArchetype, BehavioralProfile, describeBehavioralProfile, getBehavioralArchetypes, getBehavioralProfile } from "./behavioralLexicon";
import { assignArchetypeToSlogan, getBehaviorFragmentPool, getCommunityCompressionTokens, getCommunityKnowledge, scoreCulturalCompression } from "./communityKnowledgeEngine";

export const TEMPLATE_DEATH_FILTERS: RegExp[] = [
  /just one more/i,
  /powered by/i,
  /fueled by/i,
  /driven by/i,
  /no drama/i,
  /\b.+\s+&\s+chill\b/i,
  /mode$/i,
  /energy$/i,
  /vibes?$/i,
  /state of mind/i,
  /too\s+.+\s+to\s+.+/i,
  /built for/i,
];

const CHEST_PRINT_WORD_LIMIT = 7;
const CHEST_PRINT_CHAR_LIMIT = 42;
const EXPLANATORY_FILLER_PATTERNS = [
  /\bi would rather\b/i,
  /\bi tend to\b/i,
  /\bi usually\b/i,
  /\bbecause\b/i,
  /\bthat means\b/i,
  /\bright now\b/i,
  /\bon saturdays?\b/i,
  /\bi feel like\b/i,
  /\bwhen i\b/i,
];
const GENERIC_MOTIVATION_PATTERNS = [
  /\bstay positive\b/i,
  /\bnever give up\b/i,
  /\bbelieve in yourself\b/i,
  /\bdream big\b/i,
  /\bgood vibes\b/i,
  /\blive laugh love\b/i,
];
const RHYTHMIC_CONNECTORS = /\b(and|but|still|again|over|before|after|without)\b/i;

function dedupe(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function trimPunctuation(value: string): string {
  return value
    .replace(/[.!,;:]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string): string[] {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function lastMeaningfulWord(value: string): string {
  const tokens = tokenize(value);
  return tokens[tokens.length - 1] || value.toLowerCase();
}

function phraseFromRitual(ritual: string): string {
  const cleaned = trimPunctuation(ritual);
  if (/ing\b/i.test(cleaned)) return titleCase(cleaned);
  return titleCase(`Still ${cleaned}`);
}

function phraseFromFrustration(frustration: string): string {
  const cleaned = trimPunctuation(frustration);
  if (/^being\b/i.test(cleaned)) return titleCase(cleaned.replace(/^being\s+/i, ""));
  return titleCase(`Nobody Warned Me About ${cleaned}`);
}

function phraseFromSocial(social: string, emotion: string): string {
  const cleanedSocial = trimPunctuation(social).toLowerCase();
  const cleanedEmotion = trimPunctuation(emotion).toLowerCase();
  return titleCase(`${cleanedEmotion} with ${cleanedSocial}`);
}

function phraseFromAspiration(aspiration: string, slang: string): string {
  const cleanedAspiration = trimPunctuation(aspiration);
  const cleanedSlang = trimPunctuation(slang);
  return titleCase(`${cleanedAspiration} like ${cleanedSlang}`);
}

function phraseFromTension(ritual: string, frustration: string): string {
  return titleCase(`${trimPunctuation(ritual)} despite ${trimPunctuation(frustration)}`);
}

function phraseFromCompression(token: string): string {
  return titleCase(trimPunctuation(token));
}

function phraseFromCompressionTension(token: string, tension: string): string {
  const left = trimPunctuation(token);
  const right = trimPunctuation(tension).split(/\s+/).slice(0, 3).join(" ");
  return titleCase(`${left} / ${right}`);
}

function phraseFromArchetypeSignature(signature: string, psychology: string): string {
  const left = trimPunctuation(signature);
  const right = trimPunctuation(psychology).split(/\s+/).slice(0, 2).join(" ");
  return titleCase(`${left} ${right}`);
}

function phraseFromArchetypeTension(signature: string, tension: string): string {
  const left = trimPunctuation(signature);
  const right = trimPunctuation(tension).split(/\s+/).slice(0, 2).join(" ");
  return titleCase(`${left} / ${right}`);
}

function phraseFromFragment(fragment: string): string {
  return titleCase(trimPunctuation(fragment));
}

function phraseFromContradiction(value: string): string {
  return titleCase(trimPunctuation(value));
}

function phraseFromContradictionRitual(contradiction: string, ritual: string): string {
  const left = trimPunctuation(contradiction);
  const right = trimPunctuation(ritual)
    .replace(/^(stretching|checking|watching|booking|playing|arriving|filming)\s+/i, "")
    .split(/\s+/)
    .slice(0, 3)
    .join(" ");
  return titleCase(`${left} / ${right}`);
}

function phraseFromExposure(shamePattern: string, irrationalBelief: string): string {
  const left = trimPunctuation(shamePattern).replace(/^pretending\s+/i, "");
  const right = trimPunctuation(irrationalBelief).split(/\s+/).slice(0, 4).join(" ");
  return titleCase(`${left} / ${right}`);
}

function anchorFocus(anchor: string): string {
  const lower = trimPunctuation(anchor).toLowerCase();
  if (lower.includes("open play")) return "Open Play";
  if (lower.includes("kitchen")) return "Kitchen Balls";
  if (lower.includes("court availability")) return "Court Availability";
  if (lower.includes("court shoes")) return "Court Shoes";
  if (lower.includes("tournament weekend")) return "Tournament Weekend";
  if (lower.includes("wind")) return "Wind";
  if (lower.includes("dog park")) return "Dog Park";
  if (lower.includes("walk time")) return "Walk Time";
  const words = lower.split(/\s+/).filter(Boolean);
  return titleCase(words.slice(-Math.min(3, words.length)).join(" "));
}

function phraseFromEnvironmentalAnchor(anchor: string): string {
  return titleCase(trimPunctuation(anchor));
}

function selectEnvironmentalAnchorsForArchetype(anchorPool: string[], archetype: BehavioralArchetype): string[] {
  const lowerAnchors = anchorPool.map((anchor) => anchor.toLowerCase());

  if (archetype.key === "competitive_retirees") {
    return anchorPool.filter((_, index) => {
      const anchor = lowerAnchors[index];
      return anchor.includes("kitchen") || anchor.includes("court availability") || anchor.includes("open play");
    });
  }

  if (archetype.key === "social_weekenders") {
    return ["open play", "tournament weekend", "court shoes"]
      .flatMap((keyword) => {
        const index = lowerAnchors.findIndex((anchor) => anchor.includes(keyword));
        return index >= 0 ? [anchorPool[index]] : [];
      });
  }

  if (archetype.key === "obsessive_grinders") {
    return anchorPool.filter((_, index) => {
      const anchor = lowerAnchors[index];
      return anchor.includes("court availability") || anchor.includes("wind") || anchor.includes("tournament weekend");
    });
  }

  if (archetype.key === "velcro_devotees") {
    return ["walk time", "dog park", "leash by the door"]
      .flatMap((keyword) => {
        const index = lowerAnchors.findIndex((anchor) => anchor.includes(keyword));
        return index >= 0 ? [anchorPool[index]] : [];
      });
  }

  if (archetype.key === "chaos_curators") {
    return ["dog hair", "backseat", "leash by the door"]
      .flatMap((keyword) => {
        const index = lowerAnchors.findIndex((anchor) => anchor.includes(keyword));
        return index >= 0 ? [anchorPool[index]] : [];
      });
  }

  if (archetype.key === "dog_park_diplomats") {
    return ["dog park"]
      .flatMap((keyword) => {
        const index = lowerAnchors.findIndex((anchor) => anchor.includes(keyword));
        return index >= 0 ? [anchorPool[index]] : [];
      });
  }

  return anchorPool.slice(0, 3);
}

function phraseFromAnchoredLoop(anchor: string, loop: string): string | null {
  const cleanedLoop = trimPunctuation(loop).toLowerCase();
  const focus = anchorFocus(anchor);
  const beforeMatch = cleanedLoop.match(/^(.*?)\s+before\s+.+$/i);
  if (beforeMatch?.[1] && /Open Play|Court Availability|Tournament Weekend|Dog Park|Walk Time/i.test(focus)) {
    return titleCase(`${beforeMatch[1].trim()} before ${focus.toLowerCase()}`);
  }
  const afterMatch = cleanedLoop.match(/^(.*?)\s+after\s+.+$/i);
  if (afterMatch?.[1] && /Open Play|Court Availability|Tournament Weekend|Dog Park|Walk Time/i.test(focus)) {
    return titleCase(`${afterMatch[1].trim()} after ${focus.toLowerCase()}`);
  }
  return null;
}

function buildFragmentMemoryPhrases(niche: string, archetype: BehavioralArchetype, profile: BehavioralProfile): string[] {
  const pool = getBehaviorFragmentPool(niche, archetype.key, profile);
  const environmentalAnchors = selectEnvironmentalAnchorsForArchetype(getCommunityKnowledge(niche, profile).environmentalAnchors, archetype);
  const phrases: string[] = [];
  const anchoredLoopIndexes = new Set<number>();

  environmentalAnchors.slice(0, 4).forEach((anchor, index) => {
    phrases.push(phraseFromEnvironmentalAnchor(anchor));
    if (pool.obsessionLoops[index]) {
      const anchoredLoop = phraseFromAnchoredLoop(anchor, pool.obsessionLoops[index]);
      if (anchoredLoop) {
        phrases.push(anchoredLoop);
        anchoredLoopIndexes.add(index);
      }
    }
  });

  pool.contradictions.slice(0, 5).forEach((value, index) => {
    phrases.push(phraseFromContradiction(value));
    if (pool.rituals[index]) {
      phrases.push(phraseFromContradictionRitual(value, pool.rituals[index]));
    }
  });

  pool.shamePatterns.slice(0, 3).forEach((value, index) => {
    phrases.push(phraseFromFragment(value));
    if (pool.irrationalBeliefs[index]) {
      phrases.push(phraseFromExposure(value, pool.irrationalBeliefs[index]));
    }
  });

  pool.obsessionLoops.slice(0, 3).forEach((value, index) => {
    if (!anchoredLoopIndexes.has(index)) {
      phrases.push(phraseFromFragment(value));
    }
  });

  pool.microBehaviors.slice(0, 4).forEach((value) => {
    phrases.push(phraseFromFragment(value));
  });

  pool.repeatedThoughts.slice(0, 3).forEach((value, index) => {
    phrases.push(phraseFromFragment(value));
    if (pool.physicalConsequences[index]) {
      phrases.push(phraseFromCompressionTension(value, pool.physicalConsequences[index]));
    }
  });

  pool.internalJokes.slice(0, 3).forEach((value) => {
    phrases.push(phraseFromFragment(value));
  });

  pool.emotionalContradictions.slice(0, 3).forEach((value) => {
    phrases.push(phraseFromFragment(value));
  });

  pool.obsessionArtifacts.slice(0, 3).forEach((value, index) => {
    phrases.push(phraseFromFragment(value));
    if (pool.irrationalBeliefs[index]) {
      phrases.push(phraseFromCompressionTension(value, pool.irrationalBeliefs[index]));
    }
  });

  pool.socialPatterns.slice(0, 3).forEach((value, index) => {
    phrases.push(phraseFromFragment(value));
    if (pool.identitySignals[index]) {
      phrases.push(phraseFromCompressionTension(value, pool.identitySignals[index]));
    }
  });

  return dedupe(phrases)
    .map(trimPunctuation)
    .filter((value) => value.split(/\s+/).length >= 2 && value.split(/\s+/).length <= 7)
    .filter((value) => !matchesTemplateDeathFilter(value));
}

function buildArchetypeSeedPhrases(archetype: BehavioralArchetype, communityTokens: string[], niche: string, profile: BehavioralProfile): string[] {
  const signatures = archetype.signatureLanguage.slice(0, 5);
  const tensions = archetype.tensions.slice(0, 3);
  const signaturePhrases: string[] = [];
  const tensionPhrases: string[] = [];

  const fragmentPhrases = buildFragmentMemoryPhrases(niche, archetype, profile);

  signatures.forEach((signature, index) => {
    signaturePhrases.push(phraseFromCompression(signature));
    if (tensions[index]) tensionPhrases.push(phraseFromArchetypeTension(signature, tensions[index]));
    if (communityTokens[index]) tensionPhrases.push(phraseFromCompressionTension(signature, communityTokens[index]));
  });

  tensions.forEach((tension, index) => {
    const pairedSignature = signatures[index % Math.max(1, signatures.length)] || archetype.label;
    tensionPhrases.push(phraseFromArchetypeTension(pairedSignature, tension));
  });

  return dedupe([
    ...fragmentPhrases.slice(0, 7),
    ...tensionPhrases.slice(0, 4),
    ...signaturePhrases.slice(0, 1),
  ])
    .filter(Boolean)
    .map(trimPunctuation)
    .filter((value) => value.split(/\s+/).length >= 2 && value.split(/\s+/).length <= 7)
    .filter((value) => !matchesTemplateDeathFilter(value));
}

function interleaveBalancedGroups(groups: string[][], perGroupLimit = 4): string[] {
  const trimmedGroups = groups.map((group) => dedupe(group).slice(0, perGroupLimit));
  const max = Math.max(...trimmedGroups.map((group) => group.length), 0);
  const merged: string[] = [];

  for (let index = 0; index < max; index += 1) {
    for (const group of trimmedGroups) {
      if (group[index]) merged.push(group[index]);
    }
  }

  return dedupe(merged);
}

function takeBalancedArchetypeSet(archetypeGroups: string[][], fallbackPool: string[], perGroupTarget: number, fallbackLimit: number): string[] {
  const balanced = interleaveBalancedGroups(archetypeGroups, perGroupTarget);
  const spillover = dedupe(fallbackPool).slice(0, fallbackLimit);
  return dedupe([...balanced, ...spillover]);
}

function buildHumanSeedPhrases(profile: BehavioralProfile, communityTokens: string[], communityTensions: string[], environmentalAnchors: string[]): string[] {
  const rituals = profile.rituals.slice(0, 4);
  const frustrations = profile.frustrations.slice(0, 4);
  const slang = profile.slang.slice(0, 4);
  const aspirations = profile.aspirations.slice(0, 3);
  const social = profile.socialDynamics.slice(0, 3);
  const emotions = profile.emotionalTriggers.slice(0, 3);

  const phrases: string[] = [];

  rituals.forEach((ritual, index) => {
    phrases.push(phraseFromRitual(ritual));
    if (frustrations[index]) phrases.push(phraseFromTension(ritual, frustrations[index]));
  });

  frustrations.forEach((frustration) => {
    phrases.push(phraseFromFrustration(frustration));
  });

  aspirations.forEach((aspiration, index) => {
    phrases.push(phraseFromAspiration(aspiration, slang[index % Math.max(1, slang.length)] || aspiration));
  });

  social.forEach((value, index) => {
    phrases.push(phraseFromSocial(value, emotions[index % Math.max(1, emotions.length)] || "emotionally invested"));
  });

  slang.forEach((value) => {
    const token = lastMeaningfulWord(value);
    phrases.push(titleCase(`Emotionally Attached To ${token}`));
  });

  communityTokens.slice(0, 6).forEach((token, index) => {
    phrases.push(phraseFromCompression(token));
    if (communityTensions[index]) phrases.push(phraseFromCompressionTension(token, communityTensions[index]));
  });

  environmentalAnchors.slice(0, 5).forEach((anchor, index) => {
    phrases.push(phraseFromEnvironmentalAnchor(anchor));
    if (rituals[index]) {
      const anchoredLoop = phraseFromAnchoredLoop(anchor, rituals[index]);
      if (anchoredLoop) phrases.push(anchoredLoop);
    }
  });

  return dedupe(phrases)
    .map(trimPunctuation)
    .filter((value) => value.split(/\s+/).length >= 2 && value.split(/\s+/).length <= 10)
    .filter((value) => !matchesTemplateDeathFilter(value));
}

export function matchesTemplateDeathFilter(slogan: string): boolean {
  const cleaned = slogan.trim();
  return TEMPLATE_DEATH_FILTERS.some((pattern) => pattern.test(cleaned));
}

export function rejectTemplateStructures(slogans: string[]): string[] {
  return dedupe(slogans).filter((slogan) => !matchesTemplateDeathFilter(slogan));
}

export function wearabilityCompressionScore(slogan: string): number {
  const cleaned = trimPunctuation(slogan);
  if (!cleaned) return 0;
  const words = cleaned.split(/\s+/).filter(Boolean);
  const chars = cleaned.length;
  let score = 100;

  if (words.length > CHEST_PRINT_WORD_LIMIT) score -= (words.length - CHEST_PRINT_WORD_LIMIT) * 14;
  if (chars > CHEST_PRINT_CHAR_LIMIT) score -= Math.ceil((chars - CHEST_PRINT_CHAR_LIMIT) / 2) * 5;
  if (EXPLANATORY_FILLER_PATTERNS.some((pattern) => pattern.test(cleaned))) score -= 20;
  if (!RHYTHMIC_CONNECTORS.test(cleaned) && words.length >= 6) score -= 8;
  if (/[,;:]/.test(cleaned)) score -= 10;

  const uppercaseStarts = words.filter((word) => /^[A-Z]/.test(word)).length;
  if (uppercaseStarts >= Math.ceil(words.length * 0.6)) score += 4;

  return Math.max(0, Math.min(100, score));
}

export function passesChestPrintFilter(slogan: string): boolean {
  const cleaned = trimPunctuation(slogan);
  if (!cleaned) return false;
  if (cleaned.split(/\s+/).length > CHEST_PRINT_WORD_LIMIT) return false;
  if (cleaned.length > CHEST_PRINT_CHAR_LIMIT) return false;
  if (EXPLANATORY_FILLER_PATTERNS.some((pattern) => pattern.test(cleaned))) return false;
  return wearabilityCompressionScore(cleaned) >= 62;
}

export function communityAuthenticityScore(slogan: string, profile: BehavioralProfile, niche: string): number {
  const cleaned = trimPunctuation(slogan);
  if (!cleaned) return 0;
  const lower = cleaned.toLowerCase();
  const communityKnowledge = getCommunityKnowledge(niche, profile);
  const fragmentPool = getBehaviorFragmentPool(niche, assignArchetypeToSlogan(cleaned, niche).key, profile);
  const slangTokens = profile.slang.flatMap(tokenize);
  const frustrationTokens = profile.frustrations.flatMap(tokenize);
  const ritualTokens = profile.rituals.flatMap(tokenize);
  const emotionalTokens = profile.emotionalTriggers.flatMap(tokenize);
  const nicheTokens = tokenize(niche);

  let score = 32 + Math.round(scoreCulturalCompression(cleaned, niche, profile) * 0.35);
  if (slangTokens.some((token) => token.length > 2 && lower.includes(token))) score += 18;
  if (frustrationTokens.some((token) => token.length > 3 && lower.includes(token))) score += 12;
  if (ritualTokens.some((token) => token.length > 3 && lower.includes(token))) score += 10;
  if (emotionalTokens.some((token) => token.length > 3 && lower.includes(token))) score += 8;
  if (nicheTokens.some((token) => token.length > 3 && lower.includes(token)) && communityKnowledge.insiderPhrases.length === 0) score += 8;
  if (communityKnowledge.insiderPhrases.some((token) => lower.includes(token.toLowerCase()))) score += 14;
  if (communityKnowledge.compressionTokens.some((token) => lower.includes(token.toLowerCase()))) score += 12;
  if (communityKnowledge.environmentalAnchors.some((token) => lower.includes(token.toLowerCase()))) score += 14;
  else if (communityKnowledge.environmentalAnchors.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)))) score += 8;
  if (fragmentPool.contradictions.some((token) => lower.includes(token.toLowerCase()))) score += 18;
  if (fragmentPool.rituals.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)))) score += 10;
  if (fragmentPool.shamePatterns.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)))) score += 12;
  if (fragmentPool.obsessionLoops.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)))) score += 10;
  if (fragmentPool.statusSignals.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)))) score += 8;
  if (GENERIC_MOTIVATION_PATTERNS.some((pattern) => pattern.test(lower))) score -= 30;
  if (matchesTemplateDeathFilter(cleaned)) score -= 40;

  return Math.max(0, Math.min(100, score));
}

export function generateBehavioralPhrases(profile: BehavioralProfile, niche?: string): string[] {
  const nicheContext = niche || profile.slang[profile.slang.length - 1] || "community";
  const communityKnowledge = getCommunityKnowledge(nicheContext, profile);
  const communityTokens = getCommunityCompressionTokens(nicheContext, profile);
  const archetypes = getBehavioralArchetypes(nicheContext, profile);
  const archetypeGroups = archetypes.map((archetype, index) =>
    buildArchetypeSeedPhrases(archetype, communityTokens.slice(index * 2, index * 2 + 4), nicheContext, profile),
  );
  return rejectTemplateStructures(
    takeBalancedArchetypeSet(archetypeGroups, buildHumanSeedPhrases(profile, communityTokens, communityKnowledge.communityTensions, communityKnowledge.environmentalAnchors), 3, 3),
  )
    .filter((value) => passesChestPrintFilter(value));
}

export function generateDeterministicBehavioralSlogans(niche: string, audience?: string): string[] {
  const profile = getBehavioralProfile(niche, audience);
  const archetypes = getBehavioralArchetypes(niche, profile);
  const communityKnowledge = getCommunityKnowledge(niche, profile);
  const communityTokens = getCommunityCompressionTokens(niche, profile);
  const archetypeGroups = archetypes.map((archetype, index) => {
    const sliceStart = index * 3;
    return buildArchetypeSeedPhrases(archetype, communityTokens.slice(sliceStart, sliceStart + 5), niche, profile);
  });

  return rejectTemplateStructures(
    takeBalancedArchetypeSet(
      archetypeGroups,
      buildHumanSeedPhrases(profile, communityTokens, communityKnowledge.communityTensions, communityKnowledge.environmentalAnchors),
      6,
      0,
    ),
  )
    .filter((value) => passesChestPrintFilter(value));
}

export async function generateBehavioralAISlogans({
  niche,
  audience,
  profile,
  count = 24,
}: {
  niche: string;
  audience?: string;
  profile?: BehavioralProfile;
  count?: number;
}): Promise<string[]> {
  const resolvedProfile = profile || getBehavioralProfile(niche, audience);
  const archetypes = getBehavioralArchetypes(niche, resolvedProfile);
  const communityKnowledge = getCommunityKnowledge(niche, resolvedProfile);
  const fragmentPools = archetypes.map((archetype) => {
    const pool = getBehaviorFragmentPool(niche, archetype.key, resolvedProfile);
    return `- ${archetype.label} fragments: ${[
      ...pool.microBehaviors.slice(0, 2),
      ...pool.internalJokes.slice(0, 1),
      ...pool.emotionalContradictions.slice(0, 1),
      ...pool.obsessionArtifacts.slice(0, 1),
    ].join(", ")}`;
  }).join("\n");
  const profileLines = describeBehavioralProfile(resolvedProfile).slice(0, 18);
  const fallback = generateBehavioralPhrases(resolvedProfile, niche);

  try {
    const { chatCompletionSafe } = await import("./aiGateway");
    const response = await chatCompletionSafe({
      model: "gpt-4o-mini",
      temperature: 1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You write wearable t-shirt slogans that sound like real members of a community talking.",
        },
        {
          role: "user",
          content: `You are writing wearable t-shirt slogans for people deeply involved in ${niche.toUpperCase()}${audience ? ` for ${audience}` : ""}.

Behavior profile:
${profileLines.map((line) => `- ${line}`).join("\n")}

Behavioral archetypes:
${archetypes.map((archetype) => `- ${archetype.label}: ${archetype.psychology}; tensions: ${archetype.tensions.join(", ")}; language: ${archetype.signatureLanguage.join(", ")}`).join("\n")}

Community knowledge:
- insider phrases: ${communityKnowledge.insiderPhrases.slice(0, 6).join(", ")}
- tensions: ${communityKnowledge.communityTensions.slice(0, 5).join(", ")}
- stereotypes: ${communityKnowledge.stereotypeHooks.slice(0, 4).join(", ")}
- compression: ${communityKnowledge.compressionTokens.slice(0, 6).join(", ")}
- environmental anchors: ${communityKnowledge.environmentalAnchors.slice(0, 5).join(", ")}

Behavior fragments:
${fragmentPools}

Prioritize contradiction + ritual phrasing and emotional self-own truths over generic identity statements.
Use environmental anchors to make lines feel subculture-native without naming the niche directly.

Avoid all generic merchandise language.
Do not use:
- Just One More
- Powered By
- Fueled By
- Driven By
- No Drama
- Mode
- Energy
- Vibes
- State Of Mind
- Built For
- Too X To Y

Write lines that feel like:
- real conversations
- inside jokes
- emotional truths
- frustrations
- tribal identity

Use community slang naturally.
Each slogan must feel like something an actual person in the niche would say.
Keep them 2-7 words and under 42 characters.
Avoid explanatory phrases and complete sentence framing.
Balance coverage across the archetypes above. Do not let one archetype dominate the set.

Return JSON: { "slogans": ["...", "..."] }`,
        },
      ],
    });

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) return fallback.slice(0, count);
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed.slogans)) return fallback.slice(0, count);
    return rejectTemplateStructures(parsed.slogans.map(String))
      .filter((slogan) => passesChestPrintFilter(slogan))
      .slice(0, count);
  } catch {
    return fallback.slice(0, count);
  }
}

