// Script-only bootstrap: never log credentials, and never bypass server-only in production.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const app = path.resolve(__dirname, '..');
for (const file of [path.join(app, '.env.local'), path.join(app, '.env'), path.resolve(app, '../../.env')]) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].trim().replace(/^"(.*)"$/, '$1');
  }
}
const originalLoad = Module._load;
Module._load = function(request, ...args) { return request === 'server-only' ? {} : originalLoad.call(this, request, ...args); };
require('ts-node').register({ project: path.join(app, 'tsconfig.scripts.json'), transpileOnly: true });
require('tsconfig-paths').register({ baseUrl: app, paths: { '@/*': ['./*'] } });
const script = process.argv[2];
if (!/^[a-z_]+$/.test(script || '')) throw new Error('Expected script basename');
if (script === 'test_model_gateway') {
  // This suite replaces fetch before invoking the SDK. Never use a real credential.
  process.env.OPENAI_API_KEY = 'offline-test-key';
  process.env.DATABASE_URL ||= 'postgresql://offline:offline@localhost:5432/offline';
  process.env.NEXTAUTH_SECRET ||= 'offline-test-secret';
  for (const name of ['AI_MODEL_FAST', 'AI_MODEL_BALANCED', 'AI_MODEL_REASONING', 'AI_MODEL_CAPABILITIES_JSON', 'AI_REASONING_DEFAULT', 'AI_REASONING_VERIFIER', 'AI_REASONING_RECOVERY']) delete process.env[name];
}
require(path.join(__dirname, script + '.ts'));
