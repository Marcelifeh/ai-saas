const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

function loadEnvFromDotenv() {
  if (process.env.OPENAI_API_KEY) return;
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFromDotenv();

if (!process.env.OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY in environment or .env');
  process.exit(2);
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function run() {
  const niche = process.argv[2] || 'pickleball';
  const platform = 'amazon';
  const audience = 'weekenders';
  const style = 'Elite, conversion-focused';

  const system = `You are a POD slogan specialist.\nGenerate ONLY fresh t-shirt slogans for the supplied niche.\n\nRULES:\n    - Output valid JSON only.\n    - Return exactly 12 slogans.\n    - Use BEHAVIORAL HOOKS: Insider jokes, status signals, humility/bragging, relatable struggles.\n    - Wearability: Phrases humans actually say (e.g. "Just One More...", "Survivor", "Official Specialist").\n    - Avoid: "Built for X", "X state of mind", "Life is better with X".\n    - Tone: ${style}\n\nJSON SHAPE:\n{ "shirtSlogans": ["slogan 1", "slogan 2", "...", "slogan 10"] }`;

  const user = [
    `Niche: ${niche}`,
    platform ? `Platform: ${platform}` : '',
    audience ? `Audience: ${audience}` : '',
    style ? `Style/Tone: ${style}` : '',
    'Return only JSON.',
  ].filter(Boolean).join('\n\n');

  try {
    const resp = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.85,
      max_tokens: 800,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    });

    const text = resp?.choices?.[0]?.message?.content ?? JSON.stringify(resp, null, 2);
    // Print first 2000 chars to keep terminal readable
    console.log('\n=== RAW LLM OUTPUT (truncated) ===\n');
    console.log(text.slice(0, 2000));
    console.log('\n=== TRY PARSING JSON ===\n');
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed.shirtSlogans)) {
        parsed.shirtSlogans.forEach((s, i) => console.log(`${i + 1}. ${s}`));
      } else {
        console.log('Parsed JSON, but missing shirtSlogans array.');
        console.log(parsed);
      }
    } catch (e) {
      console.error('JSON parse failed, showing naive lines:');
      text.split(/\n+/).map(l => l.replace(/^[-*\d.\s"']+/, '').trim()).filter(Boolean).slice(0, 12).forEach((s, i) => console.log(`${i + 1}. ${s}`));
    }
  } catch (err) {
    console.error('LLM request failed:', err?.message || err);
    process.exit(1);
  }
}

run();
