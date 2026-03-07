const fs = require('fs');
const babel = require('@babel/core');
const html = fs.readFileSync('public/index.html', 'utf8');
const scriptStart = html.indexOf('<script type="text/babel">') + '<script type="text/babel">'.length;
const scriptEnd = html.lastIndexOf('</script>');
const script = html.substring(scriptStart, scriptEnd);

try {
    babel.transformSync(script, { presets: ['@babel/preset-react'] });
    console.log('JSX parsed successfully!');
} catch (e) {
    console.error(e.message);
}
