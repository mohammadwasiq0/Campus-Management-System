const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Find all @default(X) where X is not a number, boolean, now(), uuid(), or autoincrement()
// and add quotes around X
content = content.replace(/@default\(([A-Z_]+)\)/g, (match, val) => {
  return '@default("' + val + '")';
});

fs.writeFileSync('prisma/schema.prisma', content);
console.log('Defaults quoted');
