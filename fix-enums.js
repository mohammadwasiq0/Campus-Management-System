const fs = require('fs');
const { execSync } = require('child_process');

let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Find all enum names from enum definitions
const enumNames = [];
const enumRegex = /^enum (\w+) \{/gm;
let m;
while ((m = enumRegex.exec(content)) !== null) {
  enumNames.push(m[1]);
}

// Remove enum blocks from schema
content = content.replace(/^enum \w+ \{[\s\S]*?^\}/gm, '');

// Replace field types that reference enum names with String
enumNames.sort((a, b) => b.length - a.length);
for (const name of enumNames) {
  // Match field type references: after whitespace + fieldname + whitespace, then the enum name
  const regex = new RegExp('([ \t]+\\w+ +)(' + name + ')(\\?|\\[\\]| |$)', 'g');
  content = content.replace(regex, '$1String$3');
}

fs.writeFileSync('prisma/schema.prisma', content);
console.log('Enums replaced. Remaining enum references: ' + (content.match(/\b(SUPER_ADMIN|CHANCELLOR|MALE|FEMALE)\b/g) || []).length);

// Validate
try {
  const result = execSync('npx prisma validate 2>&1', { encoding: 'utf8' });
  console.log('Validation passed!');
  process.exit(0);
} catch(e) {
  const out = e.stdout || '';
  const errLines = (out + (e.stderr || '')).split('\n').filter(l => l.includes('error:'));
  console.log('Validation errors remaining: ' + errLines.length);
  errLines.slice(0, 3).forEach(l => console.log('  ' + l.trim()));
  process.exit(errLines.length > 0 ? 1 : 0);
}
