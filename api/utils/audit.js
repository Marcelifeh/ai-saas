const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, '../');

function crawl(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            crawl(filePath, fileList);
        } else if (file.endsWith('.js') && file !== 'audit.js') {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const jsFiles = crawl(apiPath);
let issues = [];

jsFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    const destructureRegex = /const\s+\{\s*([^}]+)\s*\}\s*=\s*require\(['"]([^'"]+)['"]\)/g;
    let match;
    while ((match = destructureRegex.exec(content)) !== null) {
        const vars = match[1].split(',').map(v => v.trim());
        const importPathRaw = match[2];

        if (importPathRaw.startsWith('.')) {
            const resolvedPathExt = path.resolve(path.dirname(file), importPathRaw.endsWith('.js') ? importPathRaw : importPathRaw + '.js');

            if (!fs.existsSync(resolvedPathExt)) {
                issues.push(`[Missing File] ${path.basename(file)} requires ${importPathRaw}`);
                continue;
            }

            const targetContent = fs.readFileSync(resolvedPathExt, 'utf8');
            const exportsMatch = targetContent.match(/module\.exports\s*=\s*\{([^}]+)\}/);

            let exportedVars = [];
            if (exportsMatch) {
                exportedVars = exportsMatch[1].split(',').map(v => v.split(':')[0].trim());
            }

            vars.forEach(v => {
                // Strip aliases like 'generateMarketSignals: originalMarketSignals'
                const realVar = v.split(':')[0].trim();
                if (realVar && !exportedVars.includes(realVar) && !targetContent.includes(`exports.${realVar}`) && !targetContent.includes(`module.exports.${realVar}`)) {
                    if (!targetContent.match(new RegExp(`exports\\.${realVar}\\s*=`))) {
                        issues.push(`[Missing Export] ${path.basename(file)} requires '${realVar}' from ${importPathRaw}`);
                    }
                }
            });
        }
    }

    // also check for direct requires: const authProvider = require('./authProvider').authProvider
    const directRegex = /const\s+(\w+)\s*=\s*require\(['"]([^'"]+)['"]\)/g;
    while ((match = directRegex.exec(content)) !== null) {
        const importPathRaw = match[2];
        if (importPathRaw.startsWith('.')) {
            const resolvedPathExt = path.resolve(path.dirname(file), importPathRaw.endsWith('.js') ? importPathRaw : importPathRaw + '.js');
            if (!fs.existsSync(resolvedPathExt)) {
                issues.push(`[Missing File] ${path.basename(file)} requires ${importPathRaw}`);
            }
        }
    }
});

console.log(JSON.stringify(issues, null, 2));
