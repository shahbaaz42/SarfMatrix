const fs = require('fs');

const contract = fs.readFileSync('component-contract.js', 'utf8');
const grammar = fs.readFileSync('grammatical-components.js', 'utf8');
const labels = fs.readFileSync('explanation-learner-labels.js', 'utf8');
const workflow = fs.readFileSync('.github/workflows/explanation-visual-audit.yml', 'utf8');

if (!contract.includes('"indicative-nun"')) throw new Error('Missing indicative-nun role in component contract.');
if (!grammar.includes('INDICATIVE_ENDING_ROLES')) throw new Error('Missing indicative present ending model.');
if (!grammar.includes('present: "indicative-nonpast"')) throw new Error('Active present must use indicative non-past identities.');
if (!grammar.includes('passivePresent: "indicative-nonpast"')) throw new Error('Passive present must use indicative non-past identities.');
if (!labels.includes('نون الرفع في الأفعال الخمسة')) throw new Error('Missing learner label for retained indicative nūn.');
if (!labels.includes('همزة المضارعة للمتكلم المفرد')) throw new Error('Missing first-person singular present-prefix label.');
if (!labels.includes('نون المضارعة للمتكلمين')) throw new Error('Missing first-person plural present-prefix label.');
if (!workflow.includes('retention-days: 7')) throw new Error('Visual audit artifacts must be retained for seven days.');

console.log('B10.10 present indicative component guard passed.');
