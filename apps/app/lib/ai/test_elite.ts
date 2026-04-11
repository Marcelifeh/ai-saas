import { runEliteSloganEngine, SloganEngineInput } from './sloganEngine';

async function testEliteEngine() {
  const input: SloganEngineInput = {
    niche: "Pickleball",
    audience: "Competitive players",
    mode: "safe"
  };

  console.log("Testing Elite Behavioral Engine with Niche: Pickleball...");
  const result = await runEliteSloganEngine(input);

  console.log("\n--- TOP SLOGANS ---");
  result.slogans.slice(0, 5).forEach((s, i) => console.log(`${i + 1}. ${s}`));

  console.log("\n--- STRUCTURAL DIVERSITY CHECK ---");
  const families = new Set(result.ranked.slice(0, 10).map(r => r.pattern));
  console.log("Unique Patterns in Top 10:", Array.from(families));

  console.log("\n--- EMOTION SCORE CHECK ---");
  result.ranked.slice(0, 5).forEach(r => {
    console.log(`- "${r.slogan}" | Emotion: ${r.emotionScore} | Final: ${r.finalScore}`);
  });

  console.log("\n--- WEARABILITY CHECK (NO PERIODS) ---");
  const periodCount = result.slogans.filter(s => s.includes('.')).length;
  console.log(`Slogans with periods: ${periodCount}`);
}

testEliteEngine().catch(console.error);
