const fs = require('fs');
const source = fs.readFileSync('explanation-learner-labels.js', 'utf8');

for (const required of [
  'relabelAlreadySplitPastEnding',
  'masculine singular addressee subject ending with fatḥah',
  'feminine singular addressee subject ending with kasrah',
  'feminine plural addressee subject ending',
  'feminine plural addressee ending (أنتنّ)',
  'first-person singular subject ending with ḍammah',
  'first-person plural subject ending',
]) {
  if (!source.includes(required)) throw new Error(`Missing normalized past learner label support: ${required}`);
}

console.log('B10.9.6 past label normalization guard passed.');
