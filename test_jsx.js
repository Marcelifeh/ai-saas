const fs = require('fs');
const acorn = require('acorn');
const jsx = require('acorn-jsx');
const babel = require('@babel/core');

const code = fs.readFileSync('public/index.html', 'utf8');
const scriptMatch = code.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);

try {
    babel.transformSync(scriptMatch[1], {
        presets: ["@babel/preset-react"],
        filename: "index.js"
    });
    console.log("No syntax errors found!");
} catch (e) {
    console.log(e.message);
}
