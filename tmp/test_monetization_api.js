const plans = require('../api/utils/plans');
const usageStore = require('../api/utils/usageStore');
const creditCosts = require('../api/utils/creditCosts');
const usageGuard = require('../api/utils/usageGuard');

const generate = require('../api/generate');
const generatePrompt = require('../api/generate-prompt');
const discover = require('../api/discover');
const bulkGenerate = require('../api/bulk-generate');
const autopilot = require('../api/autopilot');
const usage = require('../api/usage');

console.log("All modules load successfully: Syntax OK.");

// Mock req / res to test usage endpoint
const req = { method: "GET" };
const res = {
    status: (code) => res,
    json: (data) => console.log("Response:", data)
};

usage(req, res).catch(console.error);
