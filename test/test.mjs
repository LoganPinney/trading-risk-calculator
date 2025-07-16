import assert from 'node:assert';
import { calculateRiskMetrics, generateChartData, validateParams } from '../src/shared/calculations.js';

function testCalculateRiskMetrics() {
  const params = {
    startingCapital: 10000,
    riskTolerance: 2,
    dailyMaxLoss: 5,
    weeklyMaxLoss: 10,
    sharePrice: 50,
    numShares: 100,
    profitTargetPerShare: 5
  };
  const r = calculateRiskMetrics(params);
  assert.strictEqual(r.shareSize, 5000);
  assert.strictEqual(r.riskPerTrade, 200);
  assert.strictEqual(r.dailyMaxLossAmount, 500);
  assert.strictEqual(r.weeklyMaxLossAmount, 1000);
  assert.strictEqual(r.totalPotentialProfit, 500);
  assert.strictEqual(r.totalPotentialLoss, 200);
  assert.strictEqual(r.riskRewardRatio, 2.5);
  assert.strictEqual(r.tradesPerDay, 2);
  assert.strictEqual(r.tradesPerWeek, 5);
  assert.strictEqual(r.riskPercentOfCapital, 2);
}

function testCalculateRiskMetricsZero() {
  const params = {
    startingCapital: 10000,
    riskTolerance: 0,
    dailyMaxLoss: 5,
    weeklyMaxLoss: 10,
    sharePrice: 50,
    numShares: 100,
    profitTargetPerShare: 5
  };
  const r = calculateRiskMetrics(params);
  assert.strictEqual(r.totalPotentialLoss, 0);
  assert.strictEqual(r.riskRewardRatio, 0);
  assert.strictEqual(r.tradesPerDay, 0);
}

function testCalculateRiskMetricsInvalid() {
  const params = {
    startingCapital: 0,
    riskTolerance: 2,
    dailyMaxLoss: 5,
    weeklyMaxLoss: 10,
    sharePrice: 50,
    numShares: 100,
    profitTargetPerShare: 5
  };
  assert.throws(() => calculateRiskMetrics(params), /Invalid calculation parameters/);
}

function testCalculateRiskMetricsInvalidRange() {
  const params = {
    startingCapital: 10000,
    riskTolerance: 150,
    dailyMaxLoss: 5,
    weeklyMaxLoss: 10,
    sharePrice: 50,
    numShares: 100,
    profitTargetPerShare: 5
  };
  assert.throws(() => calculateRiskMetrics(params), /Invalid calculation parameters/);
}

function testValidateParamsNegative() {
  const params = {
    startingCapital: -1,
    riskTolerance: 150,
    dailyMaxLoss: -5,
    weeklyMaxLoss: 0,
    sharePrice: 0,
    numShares: -10,
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

function testGenerateChartData() {
  const params = {
    startingCapital: 10000,
    riskTolerance: 1,
    sharePrice: 10,
    profitTargetPerShare: 2
  };
  const data = generateChartData({ ...params, numShares: 0 });
  assert.strictEqual(data[0].shares, 0);
  assert.strictEqual(data[data.length - 1].shares, 200);
  assert.ok(data.every(d => d.potentialLoss >= 0));
}

function run() {
  testCalculateRiskMetrics();
  testCalculateRiskMetricsZero();
  testCalculateRiskMetricsInvalid();
  testCalculateRiskMetricsInvalidRange();
  testValidateParamsNegative();
  testGenerateChartData();
  console.log('All tests passed.');
}

run();
