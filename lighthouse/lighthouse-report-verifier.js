const report = require('./_dist/lighthouse-parsed.json');
const budgets = require('./lighthouse-budgets.json');

const errors = [];
const totalBudgets = Object.keys(budgets)
  .map(key => Object.keys(budgets[key]).length)
  .reduce((prev, curr) => {
    return prev + curr;
  }, 0);

for (let budget in budgets) {
  for (let metric in budgets[budget]) {
    let budgeted = budgets[budget][metric];
    let actual = report[budget][metric];
    ensureValuesExist(`${budget}.${metric}`, actual);
    ensureValuesExist('budgeted', budgeted);
    if (actual >= budgeted) {
      errors.push(`Budget exceeded for ${budget}.${metric}.
        Budgeted: ${budgeted}
        Actual: ${actual}`)
    }
  }
}

if (errors.length) {
  log('red', `Some lighthouse budgets failed (${errors.length}/${totalBudgets} failed)`);
  log('red', errors.join('\n'));
  process.exit(1);
} else {
  log('green', `All lighthouse budgets pass ${totalBudgets}/${totalBudgets}`);
}

function ensureValuesExist(name, actual) {
  if (typeof actual !== 'number') throw new Error(`No value in report for ${name}`);
}

function log(color, ...messages) {
  let defaultColor = '\x1b[0m';
  let colorCode = color === 'red' ? '\x1b[31m' : '\x1b[32m';
  let method = color === 'red' ? 'error' : 'log';
  console[method](colorCode, ...messages , defaultColor);
}
