const fs = require('fs');
const acorn = require('acorn');
const jsx = require('acorn-jsx');
const parser = acorn.Parser.extend(jsx());
const code = fs.readFileSync('public/index.html', 'utf8');
const scriptMatch = code.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);

try {
    parser.parse(scriptMatch[1], { sourceType: 'module', ecmaVersion: 2020 });
    console.log('Parsed successfully');
} catch (e) {
    console.error('Error at line', e.loc.line, 'col', e.loc.column, e.message);
}
