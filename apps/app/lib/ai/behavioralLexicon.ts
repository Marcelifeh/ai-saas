export interface BehavioralProfile {
  rituals: string[];
  frustrations: string[];
  slang: string[];
  aspirations: string[];
  socialDynamics: string[];
  emotionalTriggers: string[];
}

export interface BehavioralArchetype {
  key: string;
  label: string;
  psychology: string;
  tensions: string[];
  signatureLanguage: string[];
}

type BehavioralLexiconEntry = BehavioralProfile & {
  keywords: string[];
};

const FALLBACK_PROFILE: BehavioralProfile = {
  rituals: ["showing up early", "talking shop", "replaying the best part"],
  frustrations: ["being misunderstood", "bad advice", "outsiders missing the point"],
  slang: ["inside joke", "deep cut", "you get it"],
  aspirations: ["getting sharper", "being known for it", "earning respect"],
  socialDynamics: ["friendly rivalry", "obsessive group chat", "people who instantly get it"],
  emotionalTriggers: ["identity", "belonging", "earned confidence"],
};

export const behavioralLexicon: Record<string, BehavioralLexiconEntry> = {
  pickleball: {
    keywords: ["pickleball", "paddle", "dink", "kitchen", "third shot drop", "volley"],
    rituals: [
      "playing one more match",
      "early morning court runs",
      "arguing over line calls",
      "reliving every rally on the drive home",
    ],
    frustrations: [
      "kitchen violations",
      "bad partners",
      "missed volleys",
      "getting lobbed at the baseline",
    ],
    slang: ["dink", "third shot drop", "kitchen", "paddle stack"],
    aspirations: [
      "owning the soft game",
      "winning the rematch",
      "being the player nobody wants to face",
    ],
    socialDynamics: [
      "trash talk between friends",
      "weekend tournament bragging",
      "retirement-age obsession with scoreboard receipts",
    ],
    emotionalTriggers: ["competition", "social bonding", "midlife obsession"],
  },
  camping: {
    keywords: ["camping", "camp", "trail", "fire", "rv", "outdoors"],
    rituals: [
      "packing before sunrise",
      "arguing over the firewood",
      "checking the weather anyway",
      "making coffee in the cold",
    ],
    frustrations: ["wet socks", "loud campsites", "forgetting the headlamp"],
    slang: ["basecamp", "trailhead", "off-grid", "campfire coffee"],
    aspirations: ["getting farther off-grid", "earning the quiet", "sleeping under real stars"],
    socialDynamics: ["people who hate group chats but love campfire stories", "shared silence", "roughing it pride"],
    emotionalTriggers: ["escape", "self-reliance", "quiet pride"],
  },
  coffee: {
    keywords: ["coffee", "espresso", "latte", "barista", "cafe", "brew"],
    rituals: [
      "dialing in the grind",
      "judging the first sip",
      "starting conversations with coffee notes",
    ],
    frustrations: ["burnt espresso", "watery drip", "being offered decaf"],
    slang: ["dialed in", "pulling shots", "pour over", "crema"],
    aspirations: ["brewing it right every time", "finding the perfect roast", "earning barista respect"],
    socialDynamics: ["cafe regular behavior", "quiet superiority before 9am", "the friend who always picks the coffee spot"],
    emotionalTriggers: ["ritual", "taste pride", "morning stability"],
  },
  dog: {
    keywords: ["dog", "dogs", "puppy", "puppies", "paw", "rescue"],
    rituals: ["talking to the dog before people", "planning the day around walks", "checking the dog camera at dinner", "lint rolling before leaving"],
    frustrations: ["fur on every black shirt", "canceling plans for walk time", "people saying it's just a dog", "bad recall at the dog park"],
    slang: ["zoomies", "treat tax", "walkies", "velcro dog"],
    aspirations: ["being the favorite human", "giving the dog the best life", "earning lazy couch trust"],
    socialDynamics: ["dog park politics", "the dog gets introduced first", "people who wave at dogs before humans"],
    emotionalTriggers: ["protective love", "domestic chaos", "unapologetic attachment"],
  },
};

const ARCHETYPE_MAP: Record<string, BehavioralArchetype[]> = {
  pickleball: [
    {
      key: "competitive_retirees",
      label: "Competitive Retirees",
      psychology: "Scoreboard memory and line-call politics",
      tensions: ["respect vs trash talk", "soft game patience vs ego"],
      signatureLanguage: ["call that out again", "kitchen court politics", "third shot receipts", "scoreboard memory"],
    },
    {
      key: "social_weekenders",
      label: "Social Weekenders",
      psychology: "Play hard then brunch harder",
      tensions: ["friendly vibes vs keeping score", "fitness vs fun"],
      signatureLanguage: ["dink then brunch", "weekend court crew", "court before coffee", "pickleball before pancakes"],
    },
    {
      key: "obsessive_grinders",
      label: "Obsessive Grinders",
      psychology: "Practice obsession disguised as casual hobby",
      tensions: ["shoulder pain vs one more game", "gear upgrades vs budget"],
      signatureLanguage: ["my paddle stays ready", "serve mechanics daily", "replay every rally", "tournament calendar full", "shoulder pain receipts"],
    },
  ],
  camping: [
    {
      key: "escape_maximalists",
      label: "Escape Maximalists",
      psychology: "Leave the grid, keep the rituals",
      tensions: ["freedom vs logistics", "quiet vs weather chaos"],
      signatureLanguage: ["off-grid peace", "campfire routine", "sunrise setup"],
    },
    {
      key: "gear_nerds",
      label: "Gear Nerds",
      psychology: "Comfort and competence through prep",
      tensions: ["lightweight ideals vs extra gear", "efficiency vs tradition"],
      signatureLanguage: ["packed for everything", "trailhead checklist", "stove talk"],
    },
    {
      key: "quiet_purists",
      label: "Quiet Purists",
      psychology: "Silence as status",
      tensions: ["solitude vs social camping", "nature awe vs phone addiction"],
      signatureLanguage: ["less noise", "real stars", "leave no trace"],
    },
  ],
  dog: [
    {
      key: "velcro_devotees",
      label: "Velcro Devotees",
      psychology: "Attachment disguised as a flexible schedule",
      tensions: ["human plans vs walk time", "adult life vs dog-first routines"],
      signatureLanguage: ["walkies schedule", "favorite human energy", "talking to the dog first", "velcro dog behavior"],
    },
    {
      key: "chaos_curators",
      label: "Chaos Curators",
      psychology: "Domestic mess accepted as proof of love",
      tensions: ["clean clothes vs dog hair", "guest-ready house vs actual dog house"],
      signatureLanguage: ["dog hair is part of the outfit", "fur management", "backseat covered in fur", "lint roller economy"],
    },
    {
      key: "dog_park_diplomats",
      label: "Dog Park Diplomats",
      psychology: "Protective social scanning disguised as friendliness",
      tensions: ["loving dogs vs judging owners", "community vibe vs bad recall chaos"],
      signatureLanguage: ["dog park diplomacy", "treat tax collector", "bad recall radar", "reactive but sweet"],
    },
  ],
};

function dedupe(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function mergeProfiles(base: BehavioralProfile, extra: Partial<BehavioralProfile>): BehavioralProfile {
  return {
    rituals: dedupe([...(base.rituals || []), ...(extra.rituals || [])]),
    frustrations: dedupe([...(base.frustrations || []), ...(extra.frustrations || [])]),
    slang: dedupe([...(base.slang || []), ...(extra.slang || [])]),
    aspirations: dedupe([...(base.aspirations || []), ...(extra.aspirations || [])]),
    socialDynamics: dedupe([...(base.socialDynamics || []), ...(extra.socialDynamics || [])]),
    emotionalTriggers: dedupe([...(base.emotionalTriggers || []), ...(extra.emotionalTriggers || [])]),
  };
}

function matchBehavioralEntry(niche: string): BehavioralLexiconEntry | null {
  const lower = niche.toLowerCase().trim();
  for (const entry of Object.values(behavioralLexicon)) {
    if (entry.keywords.some((keyword) => lower.includes(keyword))) {
      return entry;
    }
  }
  return null;
}

function deriveProfileHeuristically(niche: string, audience?: string): Partial<BehavioralProfile> {
  const lower = `${niche} ${audience || ""}`.toLowerCase();
  if (/photography|photographer|camera|lens|shoot/.test(lower)) {
    return {
      rituals: ["waiting for golden hour", "checking the shot again", "carrying one more lens than necessary"],
      frustrations: ["people saying just use your phone", "missing the light", "bad autofocus"],
      slang: ["golden hour", "prime lens", "manual mode", "framing it right"],
      aspirations: ["nailing the shot", "seeing what other people miss"],
      socialDynamics: ["camera bag pride", "the friend who stops the group for the shot"],
      emotionalTriggers: ["creative control", "precision", "quiet flex"],
    };
  }
  if (/gym|fitness|workout|lifting|run|runner/.test(lower)) {
    return {
      rituals: ["showing up before sunrise", "logging the session", "thinking about the next set"],
      frustrations: ["skipping reps", "fake motivation", "people curling in the squat rack"],
      slang: ["PR", "locked in", "last rep", "earned it"],
      aspirations: ["getting stronger", "outworking yesterday", "earning respect without talking"],
      socialDynamics: ["silent gym nods", "competitive accountability", "the friend who sends workout receipts"],
      emotionalTriggers: ["discipline", "self-respect", "competitive focus"],
    };
  }
  if (/\b(exotic pet|exotic pets|parrot|bird|birds|reptile|reptiles|lizard|lizards|snake|snakes|gecko|geckos|iguana|terrarium|aviary)\b/.test(lower)) {
    return {
      rituals: [
        "cleaning cages before coffee",
        "planning life around feeding time",
        "talking to birds like roommates",
        "checking heat lamps and terrariums",
        "rearranging the house around animals",
      ],
      frustrations: [
        "expensive exotic vet bills",
        "birds screaming before sunrise",
        "people asking if the reptile is dangerous",
        "cage mess right after cleaning",
        "vacations planned around pet care",
      ],
      slang: [
        "feathered roommate",
        "scale baby",
        "terrarium life",
        "bird room",
        "cage cleaning",
        "the parrot talks back",
      ],
      aspirations: [
        "giving every animal the good room",
        "building the weirdest loving household",
        "being understood by the pets first",
      ],
      socialDynamics: [
        "families that introduce the animals first",
        "pet photos nobody asked for but everyone gets",
        "the house rules being set by feathers and scales",
      ],
      emotionalTriggers: ["loving chaos", "protective weirdness", "animal-first family priorities"],
    };
  }
  if (/crochet|crocheter|crocheters|yarn|knit/.test(lower)) {
    return {
      rituals: ["counting stitches twice", "untangling yarn again", "starting one more row", "carrying yarn everywhere"],
      frustrations: ["losing count mid-row", "yarn knots at midnight", "people calling crochet knitting"],
      slang: ["one more row", "yarn stash", "hook size", "frogging it"],
      aspirations: ["finishing the project before starting another", "turning yarn into proof of patience"],
      socialDynamics: ["showing progress photos nobody asked for", "the yarn stash needing its own room"],
      emotionalTriggers: ["patient obsession", "craft pride", "cozy chaos"],
    };
  }
  if (/nurse|nurses|nursing|scrubs|rn\b/.test(lower)) {
    return {
      rituals: ["charting after everyone leaves", "checking vitals before coffee", "living out of scrub pockets", "washing hands one more time"],
      frustrations: ["short staffing", "alarm fatigue", "families asking for updates during rounds", "coffee going cold again"],
      slang: ["scrub pocket", "night shift", "charting", "code brown"],
      aspirations: ["getting everyone through the shift", "staying calm when the floor is not"],
      socialDynamics: ["shift change truth sessions", "dark humor at the nurses station"],
      emotionalTriggers: ["controlled chaos", "care under pressure", "earned exhaustion"],
    };
  }
  if (/golf|golfer|golfers|putt|putting|fairway|tee/.test(lower)) {
    return {
      rituals: ["blaming the wind", "checking tee time like weather", "replaying one bad putt", "buying balls like hope"],
      frustrations: ["three-putting again", "slicing into the trees", "cart path only days", "almost pars"],
      slang: ["three putt", "mulligan", "fairway finder", "tee time"],
      aspirations: ["finding the swing for one whole round", "earning the clubhouse story"],
      socialDynamics: ["trash talk on the back nine", "scorecard negotiations"],
      emotionalTriggers: ["hopeful frustration", "competitive calm", "weekend obsession"],
    };
  }
  if (/teacher|teachers|teaching|classroom|school/.test(lower)) {
    return {
      rituals: ["grading after bedtime", "labeling everything twice", "repeating directions again", "living by the bell schedule"],
      frustrations: ["dry markers", "indoor recess", "missing glue sticks", "emails after contract hours"],
      slang: ["teacher tired", "bell schedule", "hall pass", "lesson plans"],
      aspirations: ["getting through May with grace", "turning chaos into learning"],
      socialDynamics: ["teacher lounge therapy", "classroom chaos coordination"],
      emotionalTriggers: ["patient authority", "controlled chaos", "earned summer"],
    };
  }
  if (/adhd|coder|coders|coding|developer|developers|programmer|programmers/.test(lower)) {
    return {
      rituals: ["debugging one more thing", "opening ten tabs for one bug", "forgetting why the terminal is open", "hyperfixating past midnight"],
      frustrations: ["syntax errors before coffee", "context switching", "meetings breaking focus", "unfinished side projects"],
      slang: ["debug mode", "hyperfocus", "rubber ducking", "ship it"],
      aspirations: ["turning chaos into working code", "finishing the side project this time"],
      socialDynamics: ["commit messages as emotional records", "explaining the bug to a rubber duck"],
      emotionalTriggers: ["hyperfocus", "productive chaos", "focus guilt"],
    };
  }
  if (/book|reading|reader|library|bookworm/.test(lower)) {
    return {
      rituals: ["reading one more chapter", "annotating favorite lines", "judging covers in public"],
      frustrations: ["movie tie-in covers", "people interrupting the good part", "bad endings"],
      slang: ["TBR", "annotated", "one more chapter", "dog-eared"],
      aspirations: ["finding the next obsession", "living inside the story a little longer"],
      socialDynamics: ["book club overanalysis", "quiet superiority about the source material"],
      emotionalTriggers: ["escapism", "identity", "private intensity"],
    };
  }
  return {};
}

export function getBehavioralProfile(niche: string, audience?: string): BehavioralProfile {
  const matched = matchBehavioralEntry(niche);
  const profile = matched
    ? mergeProfiles(FALLBACK_PROFILE, matched)
    : mergeProfiles(FALLBACK_PROFILE, deriveProfileHeuristically(niche, audience));

  if (!profile.slang.some((value) => value.toLowerCase().includes(niche.toLowerCase()))) {
    profile.slang = dedupe([profile.slang[0] || "you get it", niche.trim()]);
  }

  return profile;
}

function buildFallbackArchetypes(profile: BehavioralProfile): BehavioralArchetype[] {
  return [
    {
      key: "identity_competitors",
      label: "Identity Competitors",
      psychology: "They treat improvement as personal identity",
      tensions: [profile.frustrations[0] || "being misunderstood", profile.aspirations[0] || "getting sharper"],
      signatureLanguage: [profile.slang[0] || "inside joke", profile.rituals[0] || "daily ritual"],
    },
    {
      key: "social_insiders",
      label: "Social Insiders",
      psychology: "Belonging through shared references",
      tensions: [profile.socialDynamics[0] || "friendly rivalry", profile.socialDynamics[1] || "group chat energy"],
      signatureLanguage: [profile.slang[1] || "deep cut", profile.emotionalTriggers[0] || "identity"],
    },
    {
      key: "obsessive_crafters",
      label: "Obsessive Crafters",
      psychology: "Quiet obsession that looks casual from the outside",
      tensions: [profile.rituals[1] || "repetition", profile.frustrations[1] || "bad advice"],
      signatureLanguage: [profile.aspirations[1] || "being known for it", profile.slang[2] || "you get it"],
    },
  ];
}

export function getBehavioralArchetypes(niche: string, profile?: BehavioralProfile): BehavioralArchetype[] {
  const lower = niche.toLowerCase();
  for (const [key, archetypes] of Object.entries(ARCHETYPE_MAP)) {
    if (lower.includes(key)) {
      return archetypes;
    }
  }
  return buildFallbackArchetypes(profile || getBehavioralProfile(niche));
}

export function describeBehavioralProfile(profile: BehavioralProfile): string[] {
  return [
    ...profile.rituals.map((value) => `ritual: ${value}`),
    ...profile.frustrations.map((value) => `frustration: ${value}`),
    ...profile.slang.map((value) => `slang: ${value}`),
    ...profile.aspirations.map((value) => `aspiration: ${value}`),
    ...profile.socialDynamics.map((value) => `social: ${value}`),
    ...profile.emotionalTriggers.map((value) => `emotion: ${value}`),
  ];
}
