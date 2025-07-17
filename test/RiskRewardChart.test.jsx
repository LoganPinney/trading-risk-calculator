import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import assert from 'assert';
import RiskRewardChart from '../src/renderer/RiskRewardCHart';

export default function testRiskRewardChart() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;

  const { container, unmount } = render(
    <RiskRewardChart riskAmount={100} potentialProfit={150} />
  );

  // Ensure the chart SVG renders
  assert.ok(container.querySelector('svg'));
  // Scatter points group should exist
  assert.ok(container.querySelector('.recharts-scatter'));

  unmount();
  cleanup();

  delete global.window;
  delete global.document;
  delete global.navigator;
}
