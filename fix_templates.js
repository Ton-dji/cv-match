const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components/templates');
const files = fs.readdirSync(dir).filter(f => f.endsWith('Template.tsx'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix name fontSize
    content = content.replace(/fontSize:\s*\(\s*data\.fullName\?\.length\s*\|\|\s*0\s*\)\s*>\s*\d+\s*\?\s*\d+\s*:\s*\d+,/g, (match) => {
        return `fontSize: fs(${match.replace('fontSize: ', '').replace(',', '')}),`;
    });

    // Fix other hardcoded fonts/margins like `marginBottom: 4` or `fontSize: 10` ?
    // Actually, maybe not strictly necessary to fix ALL of them if the name + standard fs() + sp() shrinks enough.
    
    fs.writeFileSync(filePath, content);
});
console.log('Fixed templates');
