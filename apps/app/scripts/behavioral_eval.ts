import { generateDeterministicBehavioralSlogans, matchesTemplateDeathFilter, passesChestPrintFilter, wearabilityCompressionScore, communityAuthenticityScore } from "../lib/ai/behavioralSloganEngine";
import { assignArchetypeToSlogan, getBehaviorFragmentPool, getCommunityKnowledge, scoreCulturalCompression, truthResonanceScore } from "../lib/ai/communityKnowledgeEngine";
import { getBehavioralArchetypes, getBehavioralProfile } from "../lib/ai/behavioralLexicon";

function entropy(values: string[]): number {
  const freq = new Map<string, number>();
  values.forEach((value) => {
    const key = value.toLowerCase();
    freq.set(key, (freq.get(key) || 0) + 1);
  });
  const total = values.length || 1;
  let score = 0;
  for (const count of freq.values()) {
    const p = count / total;
    score -= p * Math.log2(p);
  }
  return Number(score.toFixed(2));
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function tokenize(value: string): string[] {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function subcultureRecognizabilityScore(
  slogan: string,
  niche: string,
  profile: ReturnType<typeof getBehavioralProfile>,
  archetypes: ReturnType<typeof getBehavioralArchetypes>,
  communityKnowledge: ReturnType<typeof getCommunityKnowledge>,
): number {
  const lower = slogan.toLowerCase();
  const assignedArchetype = assignArchetypeToSlogan(slogan, niche, archetypes);
  const fragmentPool = getBehaviorFragmentPool(niche, assignedArchetype.key, profile);
  let score = 38;

  const exactGroups = [
    profile.slang,
    communityKnowledge.insiderPhrases,
    communityKnowledge.compressionTokens,
    communityKnowledge.environmentalAnchors,
    fragmentPool.internalJokes,
  ];
  const fuzzyGroups = [
    communityKnowledge.environmentalAnchors,
    communityKnowledge.communityTensions,
    communityKnowledge.stereotypeHooks,
    profile.slang,
    fragmentPool.rituals,
    fragmentPool.contradictions,
    fragmentPool.obsessionLoops,
    fragmentPool.statusSignals,
    fragmentPool.shamePatterns,
    fragmentPool.physicalConsequences,
  ];

  exactGroups.forEach((group) => {
    if (group.some((token) => lower.includes(token.toLowerCase()))) score += 12;
  });

  fuzzyGroups.forEach((group, index) => {
    if (group.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)))) {
      score += index <= 3 ? 10 : 8;
    }
  });

  const nicheTokens = tokenize(niche);
  const hasEnvironmentalAnchor = communityKnowledge.environmentalAnchors.some((token) => tokenize(token).some((part) => part.length > 3 && lower.includes(part)));
  const hasInsiderPhrase = communityKnowledge.insiderPhrases.some((token) => lower.includes(token.toLowerCase()));

  if (nicheTokens.some((token) => token.length > 3 && lower.includes(token)) && !hasEnvironmentalAnchor && !hasInsiderPhrase) {
    score -= 8;
  }

  return Math.max(0, Math.min(100, score));
}

function evaluateNiche(niche: string, audience?: string) {
  const profile = getBehavioralProfile(niche, audience);
  const archetypes = getBehavioralArchetypes(niche, profile);
  const communityKnowledge = getCommunityKnowledge(niche, profile);
  const slogans = generateDeterministicBehavioralSlogans(niche, audience);
  const bannedHits = slogans.filter((slogan) => matchesTemplateDeathFilter(slogan)).length;
  const chestPassCount = slogans.filter((slogan) => passesChestPrintFilter(slogan)).length;
  const wordCounts = slogans.map((slogan) => slogan.split(/\s+/).filter(Boolean).length);
  const wearabilityScores = slogans.map((slogan) => wearabilityCompressionScore(slogan));
  const authenticityScores = slogans.map((slogan) => communityAuthenticityScore(slogan, profile, niche));
  const culturalCompressionScores = slogans.map((slogan) => scoreCulturalCompression(slogan, niche, profile));
  const truthScores = slogans.map((slogan) => truthResonanceScore(slogan, niche, assignArchetypeToSlogan(slogan, niche, archetypes).key, profile));
  const specificityScores = slogans.map((slogan) => subcultureRecognizabilityScore(slogan, niche, profile, archetypes, communityKnowledge));
  const archetypeAssignments = slogans.map((slogan) => assignArchetypeToSlogan(slogan, niche, archetypes));
  const archetypeBuckets = archetypes.map((archetype) => {
    const assignedSlogans = slogans.filter((_, index) => archetypeAssignments[index].key === archetype.key);
    return {
      key: archetype.key,
      label: archetype.label,
      sloganCount: assignedSlogans.length,
      phraseEntropy: entropy(assignedSlogans.map((slogan) => slogan.split(/\s+/).slice(0, 2).join(" "))),
      slogans: assignedSlogans,
    };
  });
  const warnings: string[] = [];
  if (bannedHits > 0) warnings.push("HARD_FAIL:banned_structure_hits");
  if (slogans.length && ((chestPassCount / slogans.length) * 100) < 95) warnings.push("HARD_FAIL:chest_print_pass_below_95");
  if (average(wearabilityScores) < 85) warnings.push("HARD_FAIL:avg_wearability_below_85");
  if (average(authenticityScores) < 70) warnings.push("WARN:authenticity_below_70");
  if (average(truthScores) < 70) warnings.push("WARN:truth_resonance_below_70");
  if (average(specificityScores) < 75) warnings.push("WARN:specificity_below_75");
  if (archetypeBuckets.some((bucket) => bucket.phraseEntropy > 0 && bucket.phraseEntropy < 1.4)) warnings.push("WARN:archetype_entropy_collapse");
  if (archetypeBuckets.some((bucket) => bucket.sloganCount === 0)) warnings.push("WARN:archetype_imbalance");

  return {
    niche,
    sloganCount: slogans.length,
    repetitionEntropy: entropy(slogans.map((slogan) => slogan.split(/\s+/).slice(0, 2).join(" "))),
    bannedStructureHits: bannedHits,
    avgWordCount: average(wordCounts),
    avgWearabilityCompression: average(wearabilityScores),
    avgAuthenticity: average(authenticityScores),
    avgCulturalCompression: average(culturalCompressionScores),
    avgTruthResonance: average(truthScores),
    avgNicheSpecificity: average(specificityScores),
    chestPrintPassRate: slogans.length ? Number(((chestPassCount / slogans.length) * 100).toFixed(2)) : 0,
    merchReadiness: average(
      slogans.map((slogan, index) => {
        return (wearabilityScores[index] * 0.28) + (authenticityScores[index] * 0.24) + (culturalCompressionScores[index] * 0.18) + (truthScores[index] * 0.18) + (specificityScores[index] * 0.12);
      }),
    ),
    archetypeEntropy: archetypeBuckets,
    warnings,
    slogans,
  };
}

function main() {
  const niche = process.argv[2] || "Pickleball";
  const audience = process.argv[3] || "Competitive players";
  const report = evaluateNiche(niche, audience);

  console.log(JSON.stringify(report, null, 2));
}

main();