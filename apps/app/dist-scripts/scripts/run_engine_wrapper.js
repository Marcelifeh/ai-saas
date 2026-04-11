"use strict";
const { spawnSync } = require('child_process');
const path = require('path');
const cwd = path.resolve(__dirname, '..');
const niche = process.argv[2] || 'Pickleball';
const env = { ...process.env, DISABLE_PATTERN_PERSIST: '1' };
console.log('Running live pipeline wrapper in', cwd);
// Use ts-node ESM loader so TypeScript ESM modules are handled correctly
const args = ['--loader', 'ts-node/esm', '-r', 'tsconfig-paths/register', 'scripts/run_engine.ts', niche];
const res = spawnSync(process.execPath, args, { cwd, env, stdio: 'inherit' });
if (res.error) {
    console.error('Failed to spawn runner:', res.error);
    process.exit(1);
}
process.exit(res.status || 0);
