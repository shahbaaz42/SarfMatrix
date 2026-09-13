const fs = require('fs');
const source = fs.readFileSync('explanation-learner-labels.js', 'utf8');

if (!source.includes('field !== "past" && field !== "passivePast"')) {
  throw new Error('Past ending learner layout must apply to both active and passive past.');
}

for (const label of [
  'first-person singular subject ending with ḍammah',
  'masculine singular مخاطب subject ending with fatḥah',
  'feminine singular مخاطبة subject ending with kasrah',
  'first-person plural subject ending',
]) {
  if (!source.includes(label)) throw new Error(`Missing shared past label: ${label}`);
}

console.log('B10.9.5 passive-past parity guard passed.');
