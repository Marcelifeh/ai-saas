import { BehavioralArchetype, BehavioralProfile, getBehavioralArchetypes, getBehavioralProfile } from "./behavioralLexicon";

export interface CommunityKnowledge {
  insiderPhrases: string[];
  emotionalPatterns: string[];
  communityTensions: string[];
  stereotypeHooks: string[];
  tabooBehaviors: string[];
  compressionTokens: string[];
  environmentalAnchors: string[];
  memoryPools?: Record<string, BehaviorFragmentPool>;
}

export interface BehaviorFragmentPool {
  rituals: string[];
  microBehaviors: string[];
  repeatedThoughts: string[];
  internalJokes: string[];
  contradictions: string[];
  emotionalContradictions: string[];
  obsessionArtifacts: string[];
  physicalConsequences: string[];
  irrationalBeliefs: string[];
  socialPatterns: string[];
  identitySignals: string[];
  statusSignals: string[];
  shamePatterns: string[];
  obsessionLoops: string[];
}

const COMMUNITY_KNOWLEDGE: Record<string, CommunityKnowledge> = {
  pickleball: {
    insiderPhrases: ["third shot drop", "kitchen violation", "speed up", "banger", "dinker"],
    emotionalPatterns: ["obsessive improvement", "retirement competitiveness", "social rivalry"],
    communityTensions: ["bad partners", "line call arguments", "court hogging", "stacking drama"],
    stereotypeHooks: ["weekend warriors", "competitive retirees", "paddle collectors"],
    tabooBehaviors: ["foot fault denial", "calling every ball out", "showboating on rec courts"],
    compressionTokens: ["third shot therapy", "kitchen court politics", "dink diplomacy", "paddle ego"],
    environmentalAnchors: [
      "court shoes by the door",
      "checking court availability",
      "wind ruining soft shots",
      "waiting for open play",
      "tournament weekend weather",
      "calling kitchen balls",
    ],
    memoryPools: {
      competitive_retirees: {
        rituals: ["arriving early for court gossip", "tracking every scoreboard swing", "replaying line calls before dinner"],
        microBehaviors: ["replaying line calls after the match", "narrating every scoreboard swing", "remembering who called what out"],
        repeatedThoughts: ["call that out again", "that ball was long", "scoreboard never forgets"],
        internalJokes: ["kitchen court politics", "third shot receipts", "retired but still talking trash"],
        contradictions: ["acts retired but ultra competitive", "says it is friendly then argues every call"],
        emotionalContradictions: ["friendly until the score matters", "retired body, active ego"],
        obsessionArtifacts: ["scorebook photos", "favorite paddle cover", "backup visor"],
        physicalConsequences: ["ice pack by dinner", "sunburnt forearms"],
        irrationalBeliefs: ["the score was wrong, not me", "the rematch fixes everything"],
        socialPatterns: ["group text score reports", "post-match debate club"],
        identitySignals: ["court regular", "scorekeeper energy"],
        statusSignals: ["knows every regular by paddle", "talks like the unofficial commissioner"],
        shamePatterns: ["pretends the bad call did not bother me", "still thinking about the line call at night"],
        obsessionLoops: ["rematch planning before the car starts", "score recaps before dinner"],
      },
      social_weekenders: {
        rituals: ["booking brunch before open play", "sending the court selfie immediately", "checking who is in for Saturday"],
        microBehaviors: ["booking brunch after open play", "sending court selfies", "planning outfits around open play"],
        repeatedThoughts: ["one more game before coffee", "dink then brunch", "weekends are already booked"],
        internalJokes: ["court before coffee", "pickleball before pancakes", "open play is the group chat"],
        contradictions: ["says it is casual but tracks every win", "calls it social then gets competitive fast"],
        emotionalContradictions: ["just here for fun until we keep score", "social calendar built around rec play"],
        obsessionArtifacts: ["car trunk full of court shoes", "extra sunscreen", "brunch reservation screenshot"],
        physicalConsequences: ["sore calves by Monday", "tan lines from rec play"],
        irrationalBeliefs: ["brunch tastes better after a win", "the right playlist changes the match"],
        socialPatterns: ["ladder night reshuffles friend groups", "everyone knows who is late to open play"],
        identitySignals: ["weekend court crew", "brunch league captain"],
        statusSignals: ["always knows the open-play schedule", "organizes the fun but keeps score anyway"],
        shamePatterns: ["pretending the outfit was not chosen for court photos", "telling myself brunch is not the reward"],
        obsessionLoops: ["checking weather before texting plans", "rescheduling weekends around open play"],
      },
      obsessive_grinders: {
        rituals: [
          "stretching in parking lots",
          "arriving 45 minutes early",
          "watching paddle reviews at midnight",
          "filming serves before warmups",
        ],
        microBehaviors: [
          "stretching in parking lots",
          "checking DUPR at midnight",
          "playing through knee pain",
          "watching spin breakdowns during lunch",
          "bringing backup overgrips everywhere",
          "keeping court shoes in the trunk permanently",
          "canceling plans for ladder night",
          "arguing about paddle cores",
          "filming serves in slow motion",
          "letting the weather app determine mood",
        ],
        repeatedThoughts: [
          "the new paddle fixes everything",
          "one more drill then I'm done",
          "my DUPR moved, I can feel it",
          "that serve looked cleaner on video",
        ],
        internalJokes: [
          "shoulder pain receipts",
          "tournament calendar full",
          "serve mechanics daily",
          "DUPR is the stock market",
          "overgrips everywhere",
        ],
        contradictions: [
          "checks DUPR before text messages",
          "plays through knee pain again",
          "pretending my paddle is the problem",
          "acts casual but studies it nightly",
          "buys paddles instead of saving money",
        ],
        emotionalContradictions: [
          "body hurts but still playing",
          "claims it's casual, studies it nightly",
          "says it's for fun, tracks every point",
        ],
        obsessionArtifacts: [
          "backup overgrips",
          "ball machine wishlist",
          "slow-motion serve clips",
          "court shoes in the trunk",
          "tournament spreadsheet",
        ],
        physicalConsequences: [
          "shoulder pain",
          "knee tape in the bag",
          "sore calves by breakfast",
          "pickleball elbow rumors",
        ],
        irrationalBeliefs: [
          "the right paddle core changes destiny",
          "wind only affects bad technique",
          "new shoes add spin",
          "there is always time for one more ladder night",
        ],
        socialPatterns: [
          "cancels dinner for ladder night",
          "group chat becomes film review",
          "texts drilling plans before sunrise",
          "books weekends around tournaments",
        ],
        identitySignals: [
          "practice obsession",
          "tournament mode without saying tournament",
          "my paddle stays ready",
          "open play analyst",
        ],
        statusSignals: [
          "owns too many paddles on purpose",
          "talks about cores like stock picks",
          "calendar full until tournament season ends",
        ],
        shamePatterns: [
          "pretending I do not care about DUPR",
          "telling myself the new paddle is necessary",
          "acting like my shoulder is fine",
        ],
        obsessionLoops: [
          "checking DUPR before sleep",
          "watching spin breakdowns at lunch",
          "weather app runs my social life",
        ],
      },
    },
  },
  camping: {
    insiderPhrases: ["campfire coffee", "trailhead", "leave no trace", "rain fly"],
    emotionalPatterns: ["quiet pride", "escape ritual", "gear competence"],
    communityTensions: ["loud neighbors", "wet socks", "forgotten stakes"],
    stereotypeHooks: ["gear nerds", "sunrise people", "off-grid romantics"],
    tabooBehaviors: ["bluetooth speakers at camp", "trash left behind", "fake ruggedness"],
    compressionTokens: ["trailhead therapy", "campfire politics", "off-grid peace", "rain fly faith"],
    environmentalAnchors: ["camp chairs drying in the garage", "checking the rain fly twice", "wet socks by sunrise", "campfire smoke in every hoodie"],
  },
  coffee: {
    insiderPhrases: ["dialed in", "pulling shots", "crema check", "pour over"],
    emotionalPatterns: ["ritual before language", "taste superiority", "cafe routine"],
    communityTensions: ["burnt espresso", "bad milk texture", "being offered decaf"],
    stereotypeHooks: ["cafe regulars", "home bar obsessives", "roast snobs"],
    tabooBehaviors: ["microwaved coffee", "syrup overload", "ordering with no clue"],
    compressionTokens: ["crema standards", "espresso mood", "dialed in daily", "latte politics"],
    environmentalAnchors: ["grinder on the counter", "dialing in before speaking", "burnt milk ruining the morning", "checking cafe hours before plans"],
  },
  dog: {
    insiderPhrases: ["zoomies", "treat tax", "walkies", "velcro dog"],
    emotionalPatterns: ["protective devotion", "domestic chaos", "pet-first priorities"],
    communityTensions: ["fur everywhere", "bad recall", "dog park politics"],
    stereotypeHooks: ["rescue people", "treat smugglers", "couch negotiators"],
    tabooBehaviors: ["not saying hi to the dog", "complaining about dog photos", "off-leash arrogance"],
    compressionTokens: ["treat tax collector", "walkies schedule", "dog park diplomacy", "fur management"],
    environmentalAnchors: ["leash by the door", "dog hair on black clothes", "checking dog park weather", "canceling plans for walk time", "backseat covered in fur", "treat jar on the counter"],
    memoryPools: {
      velcro_devotees: {
        rituals: ["saying good morning to the dog first", "planning errands around walk time", "checking the pet camera at dinner"],
        microBehaviors: ["talking to the dog before people", "canceling plans for walk time", "sleeping on six inches of mattress", "leaving parties early for the dog"],
        repeatedThoughts: ["the dog has been alone too long", "one more walk fixes everything", "they looked sad when I left"],
        internalJokes: ["velcro dog behavior", "favorite human energy", "walkies schedule"],
        contradictions: ["talking to the dog before people again", "canceling plans for walk time", "says no more treats then folds instantly"],
        emotionalContradictions: ["fully adult except about the dog", "needs space but wants the velcro dog closer"],
        obsessionArtifacts: ["leash by the door", "pet camera notifications", "treat jar on the counter"],
        physicalConsequences: ["crooked sleep posture", "lint on every hoodie"],
        irrationalBeliefs: ["one more walk will solve the mood", "the dog understands every word"],
        socialPatterns: ["sending dog photos instead of updates", "choosing restaurants by patio rules"],
        identitySignals: ["favorite human status", "dog-first calendar"],
        statusSignals: ["knows every dog on the block", "gets judged by leash setup"],
        shamePatterns: ["pretending I was already heading home for walk time", "acting like the pet camera is normal"],
        obsessionLoops: ["leaving early before walk time", "checking weather before dog park", "watching the pet camera at dinner"],
      },
      chaos_curators: {
        rituals: ["lint rolling black clothes before leaving", "vacuuming around the same corners", "shaking out the backseat blanket"],
        microBehaviors: ["dog hair on black clothes", "backseat covered in fur", "keeping spare poop bags everywhere", "washing blankets every weekend"],
        repeatedThoughts: ["black clothes were never realistic", "that smell is probably from the dog", "the couch cover counts as clean"],
        internalJokes: ["fur management", "lint roller economy", "dog hair is the accessory"],
        contradictions: ["dog hair is part of the outfit", "calls it clean with fur on everything", "bought the couch for the dog honestly"],
        emotionalContradictions: ["loves the chaos hates the vacuuming", "wants a clean house keeps adding blankets"],
        obsessionArtifacts: ["lint rollers in every room", "backseat blanket", "paw-wipe stash"],
        physicalConsequences: ["fur in the coffee", "mystery bruises from zoomies"],
        irrationalBeliefs: ["one lint roll resets the outfit", "the couch cover makes it guest-ready"],
        socialPatterns: ["warning guests about fur after they sit", "apologizing for the smell without changing anything"],
        identitySignals: ["house runs on dog hair", "black clothes are a challenge"],
        statusSignals: ["owns lint rollers in bulk", "can spot fur on anything instantly"],
        shamePatterns: ["pretending the black shirt was still wearable", "telling myself the couch does not smell like dog"],
        obsessionLoops: ["lint rolling before dinner", "shaking out the car again", "washing blankets every weekend"],
      },
      dog_park_diplomats: {
        rituals: ["scanning the park before unclipping the leash", "bringing treats for every situation", "checking dog park weather before leaving"],
        microBehaviors: ["judging bad recall silently", "crossing the street for bad leash energy", "checking dog park weather", "asking the dog's name before the owner's"],
        repeatedThoughts: ["not every dog wants to say hi", "read the body language please", "today could be a normal dog park trip"],
        internalJokes: ["dog park diplomacy", "reactive but sweet", "bad recall radar", "treat tax collector"],
        contradictions: ["friendly dog owner private blacklist", "every dog welcome until bad recall", "baby voice still studying leash tension"],
        emotionalContradictions: ["loves the community hates the chaos", "wants social dogs without social owners"],
        obsessionArtifacts: ["treat pouch", "long leash opinions", "backseat water bowl"],
        physicalConsequences: ["mud on the cuffs", "tennis ball in every pocket"],
        irrationalBeliefs: ["good treats can fix the vibe", "today will be a normal dog park trip"],
        socialPatterns: ["making friends through the dog first", "remembering dogs faster than owners", "rerouting walks to avoid one bad park regular"],
        identitySignals: ["dog park regular", "rescue people radar"],
        statusSignals: ["knows which dogs can mix", "spots bad leash etiquette instantly", "bad recall radar"],
        shamePatterns: ["pretending I was not judging recall", "acting normal while scanning every dog"],
        obsessionLoops: ["checking weather before dog park", "rerouting walks before dog park", "reading park vibes before coffee"],
      },
    },
  },
};

function dedupe(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function tokenize(value: string): string[] {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function keyForNiche(niche: string): string | null {
  const lower = niche.toLowerCase();
  for (const key of Object.keys(COMMUNITY_KNOWLEDGE)) {
    if (lower.includes(key)) return key;
  }
  return null;
}

function buildFallbackKnowledge(profile: BehavioralProfile): CommunityKnowledge {
  return {
    insiderPhrases: dedupe(profile.slang.slice(0, 4)),
    emotionalPatterns: dedupe(profile.emotionalTriggers.slice(0, 3)),
    communityTensions: dedupe(profile.frustrations.slice(0, 4)),
    stereotypeHooks: dedupe(profile.socialDynamics.slice(0, 3)),
    tabooBehaviors: dedupe(profile.frustrations.slice(0, 2).map((value) => `avoid ${value}`)),
    compressionTokens: dedupe([
      ...profile.slang.slice(0, 2).map((value) => `${value} energy`),
      ...profile.rituals.slice(0, 2).map((value) => value.split(/\s+/).slice(0, 3).join(" ")),
    ]),
    environmentalAnchors: dedupe([...profile.rituals.slice(0, 2), ...profile.socialDynamics.slice(0, 2)]),
    memoryPools: {},
  };
}

export function getCommunityKnowledge(niche: string, profile?: BehavioralProfile): CommunityKnowledge {
  const resolvedProfile = profile || getBehavioralProfile(niche);
  const key = keyForNiche(niche);
  const base = key ? COMMUNITY_KNOWLEDGE[key] : buildFallbackKnowledge(resolvedProfile);

  return {
    insiderPhrases: dedupe([...base.insiderPhrases, ...resolvedProfile.slang]),
    emotionalPatterns: dedupe([...base.emotionalPatterns, ...resolvedProfile.emotionalTriggers]),
    communityTensions: dedupe([...base.communityTensions, ...resolvedProfile.frustrations]),
    stereotypeHooks: dedupe([...base.stereotypeHooks, ...resolvedProfile.socialDynamics]),
    tabooBehaviors: dedupe(base.tabooBehaviors),
    compressionTokens: dedupe([...base.compressionTokens, ...resolvedProfile.slang.slice(0, 2)]),
    environmentalAnchors: dedupe([...base.environmentalAnchors, ...resolvedProfile.rituals.slice(0, 2), ...resolvedProfile.socialDynamics.slice(0, 1)]),
    memoryPools: base.memoryPools || {},
  };
}

function buildFallbackMemoryPool(profile: BehavioralProfile): BehaviorFragmentPool {
  return {
    rituals: dedupe(profile.rituals.slice(0, 4)),
    microBehaviors: dedupe(profile.rituals.slice(0, 4)),
    repeatedThoughts: dedupe(profile.aspirations.slice(0, 3)),
    internalJokes: dedupe(profile.slang.slice(0, 3)),
    contradictions: dedupe(profile.frustrations.slice(0, 2).map((value, index) => `${value} but ${profile.aspirations[index] || "still doing it"}`)),
    emotionalContradictions: dedupe(profile.emotionalTriggers.slice(0, 2).map((value, index) => `${value} but ${profile.frustrations[index] || "still in it"}`)),
    obsessionArtifacts: dedupe(profile.slang.slice(0, 2).map((value) => `${value} gear`)),
    physicalConsequences: dedupe(profile.frustrations.slice(0, 2)),
    irrationalBeliefs: dedupe(profile.aspirations.slice(0, 2).map((value) => `${value} fixes everything`)),
    socialPatterns: dedupe(profile.socialDynamics.slice(0, 3)),
    identitySignals: dedupe([...profile.emotionalTriggers.slice(0, 2), ...profile.slang.slice(0, 2)]),
    statusSignals: dedupe(profile.socialDynamics.slice(0, 2).map((value) => `${value} status`)),
    shamePatterns: dedupe(profile.frustrations.slice(0, 2).map((value) => `pretending ${value} is fine`)),
    obsessionLoops: dedupe(profile.rituals.slice(0, 2).map((value) => `${value} again`)),
  };
}

export function getBehaviorFragmentPool(niche: string, archetypeKey?: string, profile?: BehavioralProfile): BehaviorFragmentPool {
  const knowledge = getCommunityKnowledge(niche, profile);
  const resolvedProfile = profile || getBehavioralProfile(niche);
  if (archetypeKey && knowledge.memoryPools?.[archetypeKey]) {
    return knowledge.memoryPools[archetypeKey]!;
  }
  return buildFallbackMemoryPool(resolvedProfile);
}

export function getCommunityCompressionTokens(niche: string, profile?: BehavioralProfile): string[] {
  const knowledge = getCommunityKnowledge(niche, profile);
  const lowerNiche = niche.toLowerCase().trim();
  return dedupe([
    ...knowledge.insiderPhrases,
    ...knowledge.communityTensions,
    ...knowledge.stereotypeHooks,
    ...knowledge.compressionTokens,
  ])
    .filter((token) => token.toLowerCase().trim() !== lowerNiche)
    .slice(0, 16);
}

export function scoreCulturalCompression(slogan: string, niche: string, profile?: BehavioralProfile): number {
  const knowledge = getCommunityKnowledge(niche, profile);
  const lower = slogan.toLowerCase();
  let score = 35;

  if (knowledge.compressionTokens.some((token) => lower.includes(token.toLowerCase()))) score += 28;
  if (knowledge.environmentalAnchors.some((token) => lower.includes(token.toLowerCase()))) score += 18;
  else if (knowledge.environmentalAnchors.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)))) score += 10;
  if (knowledge.insiderPhrases.some((token) => lower.includes(token.toLowerCase()))) score += 18;
  if (knowledge.communityTensions.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)))) score += 10;
  if (knowledge.stereotypeHooks.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)))) score += 8;
  if (knowledge.tabooBehaviors.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)))) score += 6;

  return Math.max(0, Math.min(100, score));
}

export function truthResonanceScore(slogan: string, niche: string, archetypeKey?: string, profile?: BehavioralProfile): number {
  const pool = getBehaviorFragmentPool(niche, archetypeKey, profile);
  const lower = slogan.toLowerCase();
  let score = 28;

  const tokenGroups = [
    pool.rituals,
    pool.microBehaviors,
    pool.repeatedThoughts,
    pool.contradictions,
    pool.emotionalContradictions,
    pool.physicalConsequences,
    pool.socialPatterns,
    pool.identitySignals,
    pool.statusSignals,
    pool.shamePatterns,
    pool.obsessionLoops,
  ];

  tokenGroups.forEach((group, index) => {
    if (group.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)))) {
      score += index <= 4 ? 12 : 8;
    }
  });

  if (pool.internalJokes.some((token) => lower.includes(token.toLowerCase()))) score += 10;
  if (pool.irrationalBeliefs.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)))) score += 8;
  if (pool.obsessionArtifacts.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)))) score += 8;

  return Math.max(0, Math.min(100, score));
}

export function assignArchetypeToSlogan(
  slogan: string,
  niche: string,
  archetypes?: BehavioralArchetype[],
): BehavioralArchetype {
  const resolvedArchetypes = archetypes || getBehavioralArchetypes(niche);
  const lower = slogan.toLowerCase();
  const communityKnowledge = getCommunityKnowledge(niche);

  let winner = resolvedArchetypes[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const archetype of resolvedArchetypes) {
    const fragmentPool = getBehaviorFragmentPool(niche, archetype.key);
    const tokens = [
      ...archetype.signatureLanguage,
      ...archetype.tensions,
      archetype.label,
      archetype.psychology,
      ...communityKnowledge.stereotypeHooks,
      ...fragmentPool.microBehaviors,
      ...fragmentPool.repeatedThoughts,
      ...fragmentPool.internalJokes,
      ...fragmentPool.contradictions,
      ...fragmentPool.emotionalContradictions,
      ...fragmentPool.obsessionArtifacts,
      ...fragmentPool.physicalConsequences,
      ...fragmentPool.irrationalBeliefs,
      ...fragmentPool.socialPatterns,
      ...fragmentPool.identitySignals,
      ...fragmentPool.statusSignals,
      ...fragmentPool.shamePatterns,
      ...fragmentPool.obsessionLoops,
    ];
    const score = tokens.reduce((sum, token) => {
      const parts = tokenize(token);
      return sum + parts.reduce((partSum, part) => partSum + (part.length > 2 && lower.includes(part) ? 1 : 0), 0);
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      winner = archetype;
    }
  }

  if (bestScore <= 0) {
    const normalized = lower.replace(/[^a-z0-9]+/g, " ");
    if (/brunch|weekend|crew|coffee/.test(normalized)) {
      return resolvedArchetypes.find((archetype) => /social|weekend/i.test(archetype.key + archetype.label)) || winner;
    }
    if (/shoulder|replay|mechanic|ready|tournament|practice/.test(normalized)) {
      return resolvedArchetypes.find((archetype) => /obsessive|grinder/i.test(archetype.key + archetype.label)) || winner;
    }
  }

  return winner;
}