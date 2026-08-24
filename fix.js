const fs = require('fs');
const path = 'client/src/pages/QuotationPage.jsx';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// Keep lines 0 to 744 (0-indexed, so lines 1 to 745)
const part1 = lines.slice(0, 745);

// Keep lines 939 to end (0-indexed, so lines 940 to end)
const part2 = lines.slice(939);

const newContent = [...part1, ...part2].join('\n');
fs.writeFileSync(path, newContent);
console.log('Fixed successfully');
