const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'components', 'Sidebar.tsx');
if (!fs.existsSync(filePath)) {
  console.log('Sidebar file not found, skipping validation.');
  process.exit(0);
}

const content = fs.readFileSync(filePath, 'utf8');

const forbidden = [
  '/drivers',
  '/map',
  '/rides',
  '/companies',
  '/pricing',
  '/invoices',
  '/settings',
  '/audit',
];

const found = forbidden.filter((f) => new RegExp(`to\s*=\s*["'\\`]${f}["'\\`]`).test(content));

if (found.length > 0) {
  console.error('❌ Forbidden sidebar links detected:');
  found.forEach((f) => console.error(` - ${f}`));
  console.error('\nUpdate src/components/Sidebar.tsx to remove these links.');
  process.exit(1);
}

console.log('✅ Sidebar validation passed — no forbidden links found.');
process.exit(0);
