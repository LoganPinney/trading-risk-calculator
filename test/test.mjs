import assert from 'assert';
import { calculateRiskMetrics, generateChartData, validateParams } from '../src/utils/calculations.js';

function testCalculateRiskMetrics() {
  const params = {
    startingCapital: 10000,
    riskTolerance: 2,
    dailyMaxLoss: 5,
    weeklyMaxLoss: 10,
    sharePrice: 50,
    numShares: 100,
    profitTargetPerShare: 2
  };
  const result = calculateRiskMetrics(params);
  assert.strictEqual(result.shareSize, 5000);
  assert.strictEqual(result.riskPerTrade, 200);
  assert.strictEqual(result.dailyMaxLossAmount, 500);
  assert.strictEqual(result.weeklyMaxLossAmount, 1000);
  assert.strictEqual(result.totalPotentialProfit, 200);
  assert.strictEqual(result.totalPotentialLoss, 200);
  assert.strictEqual(result.riskRewardRatio, 1);
  assert.strictEqual(result.tradesPerDay, 2);
  assert.strictEqual(result.tradesPerWeek, 5);
  assert.strictEqual(result.riskPercentOfCapital, 2);
}

function testCalculateRiskMetricsZeroRisk() {
  const params = {
    startingCapital: 10000,
    riskTolerance: 0,
    dailyMaxLoss: 5,
    weeklyMaxLoss: 10,
    sharePrice: 50,
    numShares: 100,
    profitTargetPerShare: 2
  };
  const result = calculateRiskMetrics(params);
  assert.strictEqual(result.riskPerTrade, 0);
  assert.strictEqual(result.totalPotentialLoss, 0);
  assert.strictEqual(result.riskRewardRatio, 0);
  assert.strictEqual(result.tradesPerDay, 0);
  assert.strictEqual(result.tradesPerWeek, 0);
  assert.strictEqual(result.riskPercentOfCapital, 0);
}

function testGenerateChartData() {
  const params = {
    startingCapital: 10000,
    riskTolerance: 2,
    sharePrice: 50,
    profitTargetPerShare: 2
  };
  const data = generateChartData(params);
  assert.strictEqual(data.length, 21);
  assert.deepStrictEqual(data[0], {
    shares: 0,
    shareSize: 0,
    potentialProfit: 0,
    potentialLoss: 0,
    riskPercent: 0
  });
  const last = data[data.length - 1];
  assert.strictEqual(last.shares, 200);
  assert.strictEqual(last.shareSize, 10000);
  assert.strictEqual(last.potentialProfit, 400);
  assert.strictEqual(last.potentialLoss, 200);
  assert.strictEqual(last.riskPercent, 2);
}

function testGenerateChartDataZeroSharePrice() {
  const params = {
    startingCapital: 5000,
    riskTolerance: 5,
    sharePrice: 0,
    profitTargetPerShare: 1
  };
  const data = generateChartData(params);
  assert.ok(data.every(d => d.shareSize === 0));
  assert.ok(data.every(d => d.potentialLoss === 0));
  assert.ok(data.every(d => d.riskPercent === 0));
}

function testValidateParamsValid() {
  const params = {
    startingCapital: 10000,
    riskTolerance: 2,
    dailyMaxLoss: 5,
    weeklyMaxLoss: 10,
    sharePrice: 50,
    numShares: 100,
    profitTargetPerShare: 2
  };
  const errors = validateParams(params);
  assert.strictEqual(errors.length, 0);
}

function testValidateParamsInvalid() {
  const params = {
    startingCapital: -100,
    riskTolerance: 200,
    dailyMaxLoss: 0,
    weeklyMaxLoss: -5,
    sharePrice: 0,
    numShares: 0,
    profitTargetPerShare: -1
  };
  const errors = validateParams(params);
  assert.ok(errors.includes('Starting capital must be greater than 0'));
  assert.ok(errors.includes('Risk tolerance must be between 0 and 100%'));
  assert.ok(errors.includes('Daily max loss must be between 0 and 100%'));
  assert.ok(errors.includes('Weekly max loss must be between 0 and 100%'));
  assert.ok(errors.includes('Share price must be greater than 0'));
  assert.ok(errors.includes('Number of shares must be greater than 0'));
  assert.ok(errors.includes('Profit target per share must be greater than 0'));
}

const tests = [
  { name: 'calculateRiskMetrics', fn: testCalculateRiskMetrics },
  { name: 'calculateRiskMetrics zero risk', fn: testCalculateRiskMetricsZeroRisk },
  { name: 'generateChartData', fn: testGenerateChartData },
  { name: 'generateChartData zero share price', fn: testGenerateChartDataZeroSharePrice },
  { name: 'validateParams valid', fn: testValidateParamsValid },
  { name: 'validateParams invalid', fn: testValidateParamsInvalid }
];

let failed = 0;
for (const t of tests) {
  try {
    t.fn();
    console.log('✓', t.name);
  } catch (err) {
    failed++;
    console.error('✗', t.name);
    console.error(err);
  }
}

if (failed === 0) {
  console.log('All tests passed');
} else {
  console.error(`${failed} tests failed`);
  process.exit(1);
}