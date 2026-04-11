const fs = require('fs');
const path = require('path');

function loadDotenv(envPath) {
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    let key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

async function callOpenAI(prompt) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set in environment');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a concise creative copywriter focused on short, punchy merch slogans. Return exactly 5 comma-separated variants with no extra commentary.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
    timeout: 120000,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${txt}`);
  }
  const data = await res.json();
  const msg = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  return msg;
}

function parseCSV(csvPath) {
  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const rows = [];
  // naive CSV parse assuming no commas inside fields for our export
  const header = lines[0].split(',').map(h => h.replace(/"/g,'').trim());
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    // join leftover cols into design_notes maybe
    const slogan = cols[0].replace(/"/g,'');
    const category = cols[1] ? cols[1].replace(/"/g,'') : '';
    const adA = cols[2] ? cols[2].replace(/"/g,'') : '';
    const adB = cols[3] ? cols[3].replace(/"/g,'') : '';
    const design = cols.slice(4).join(',').replace(/"/g,'');
    rows.push({ slogan, category, adA, adB, design });
  }
  return rows;
}

(async () => {
  try {
    loadDotenv(path.resolve(__dirname, '..', '.env'));
    const csvPath = path.resolve(__dirname, 'launch_pack.csv');
    if (!fs.existsSync(csvPath)) {
      console.error('launch_pack.csv not found at', csvPath);
      process.exit(1);
    }
    const rows = parseCSV(csvPath);
    const outRows = [];
    for (const r of rows) {
      const prompt = `Polish this slogan for merch: \"${r.slogan}\"\nRequirements: produce exactly 5 short (<=5 words when possible), punchy human-sounding variants, remove filler words, prefer under 4 words, keep phrasing people actually say. Return variants as a single comma-separated line.`;
      console.log('Polishing:', r.slogan);
      let response;
      try {
        response = await callOpenAI(prompt);
      } catch (err) {
        console.error('OpenAI call failed for', r.slogan, err.message);
        // fallback: return simple heuristic variants
        const fallback = [r.slogan, r.slogan, r.slogan, r.slogan, r.slogan].join(',');
        response = fallback;
      }
      const variants = response.split(',').map(s => s.trim()).slice(0,5);
      while (variants.length < 5) variants.push('');
      outRows.push({ ...r, variants });
      // small delay
      await new Promise(res => setTimeout(res, 500));
    }

    const outPath = path.resolve(__dirname, 'polished_launch_pack.csv');
    const header = 'original,category,variant1,variant2,variant3,variant4,variant5,ad_copy_A,ad_copy_B,design_notes\n';
    const lines = outRows.map(r => {
      const cols = [
        `"${r.slogan.replace(/"/g,'""')}"`,
        `"${r.category.replace(/"/g,'""')}"`,
        `"${r.variants[0].replace(/"/g,'""')}"`,
        `"${r.variants[1].replace(/"/g,'""')}"`,
        `"${r.variants[2].replace(/"/g,'""')}"`,
        `"${r.variants[3].replace(/"/g,'""')}"`,
        `"${r.variants[4].replace(/"/g,'""')}"`,
        `"${r.adA.replace(/"/g,'""')}"`,
        `"${r.adB.replace(/"/g,'""')}"`,
        `"${r.design.replace(/"/g,'""')}"`
      ];
      return cols.join(',');
    });
    fs.writeFileSync(outPath, header + lines.join('\n'));
    console.log('Wrote polished CSV to', outPath);
  } catch (err) {
    console.error('Fatal error', err);
    process.exit(1);
  }
})();
