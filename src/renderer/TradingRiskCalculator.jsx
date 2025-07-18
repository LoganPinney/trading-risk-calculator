import React, { useState, useEffect, useCallback } from 'react';
import {
  Calculator,
  TrendingUp,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { Slider } from '@mui/material';
import {
  calculateRiskAmount,
  calculateStopLossDistance,
  calculateTakeProfitDistance,
  calculatePositionSize,
  calculatePotentialProfit,
  calculateRiskRewardRatio
} from '../shared/calculations';
import RiskRewardChart from './RiskRewardChart';

const TradingRiskCalculator = () => {
  const [formData, setFormData] = useState({
    accountBalance: '',
    riskPercentage: 2,
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    positionType: 'long'
  });

  const [calculations, setCalculations] = useState({
    riskAmount: 0,
    positionSize: 0,
    potentialProfit: 0,
    riskRewardRatio: 0,
    stopLossDistance: 0,
    takeProfitDistance: 0
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateRisk = useCallback(() => {
    const {
      accountBalance,
      riskPercentage,
      entryPrice,
      stopLoss,
      takeProfit,
      positionType
    } = formData;

    if (!accountBalance || !riskPercentage || !entryPrice || !stopLoss) {
      setCalculations({
        riskAmount: 0,
        positionSize: 0,
        potentialProfit: 0,
        riskRewardRatio: 0,
        stopLossDistance: 0,
        takeProfitDistance: 0
      });
      return;
    }
    const balance = parseFloat(accountBalance);
    const risk = parseFloat(riskPercentage);
    const entry = parseFloat(entryPrice);
    const stop = parseFloat(stopLoss);
    const tp = takeProfit ? parseFloat(takeProfit) : 0;

    const riskAmount = calculateRiskAmount(balance, risk);
    const stopLossDistance = calculateStopLossDistance(entry, stop, positionType);
    const positionSize = calculatePositionSize(riskAmount, stopLossDistance);
    const takeProfitDistance = calculateTakeProfitDistance(entry, tp, positionType);
    const potentialProfit = calculatePotentialProfit(positionSize, takeProfitDistance);
    const riskRewardRatio = calculateRiskRewardRatio(potentialProfit, riskAmount);

    setCalculations({
      riskAmount,
      positionSize,
      potentialProfit,
      riskRewardRatio,
      stopLossDistance,
      takeProfitDistance
    });
  }, [formData]);

  useEffect(() => {
    calculateRisk();
  }, [calculateRisk]);

  const getRiskLevel = () => {
    const risk = parseFloat(formData.riskPercentage);
    if (risk <= 1) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (risk <= 2) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const riskLevel = getRiskLevel();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Trading Risk Calculator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Balance ($)
            </label>
            <input
              type="number"
              name="accountBalance"
              value={formData.accountBalance}
              onChange={handleInputChange}
              placeholder="10000"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Risk Percentage (%)
            </label>
            <Slider
              className="w-full"
              value={formData.riskPercentage}
              onChange={(e, v) =>
                setFormData({ ...formData, riskPercentage: v })
              }
              min={0}
              max={10}
              step={0.1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position Type
            </label>
            <select
              name="positionType"
              value={formData.positionType}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="long">Long Position</option>
              <option value="short">Short Position</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entry Price ($)
            </label>
            <Slider
              className="w-full"
              value={formData.entryPrice}
              onChange={(e, v) =>
                setFormData({ ...formData, entryPrice: v })
              }
              min={0}
              step={0.01}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stop Loss ($)
            </label>
            <Slider
              className="w-full"
              value={formData.stopLoss}
              onChange={(e, v) =>
                setFormData({ ...formData, stopLoss: v })
              }
              min={0}
              step={0.01}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Take Profit ($) - Optional
            </label>
            <Slider
              className="w-full"
              value={formData.takeProfit}
              onChange={(e, v) =>
                setFormData({ ...formData, takeProfit: v })
              }
              min={0}
              step={0.01}
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${riskLevel.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={`w-5 h-5 ${riskLevel.color}`} />
              <span className={`font-medium ${riskLevel.color}`}>
                Risk Level: {riskLevel.level}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-700">Risk Amount</span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                ${calculations.riskAmount.toFixed(2)}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="block text-sm text-gray-600 mb-1">Position Size</span>
              <span className="text-xl font-semibold text-gray-800">
                {calculations.positionSize.toFixed(2)} shares
              </span>
            </div>

            {calculations.potentialProfit > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-700">Potential Profit</span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  ${calculations.potentialProfit.toFixed(2)}
                </span>
              </div>
            )}

            {calculations.riskRewardRatio > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="block text-sm text-gray-600 mb-1">Risk/Reward Ratio</span>
                <span className="text-xl font-semibold text-gray-800">
                  1:{calculations.riskRewardRatio.toFixed(2)}
                </span>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="block text-sm text-gray-600 mb-1">Stop Loss Distance</span>
              <span className="text-lg font-semibold text-gray-800">
                ${Math.abs(calculations.stopLossDistance).toFixed(2)}
              </span>
            </div>

            {calculations.takeProfitDistance > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="block text-sm text-gray-600 mb-1">Take Profit Distance</span>
                <span className="text-lg font-semibold text-gray-800">
                  ${calculations.takeProfitDistance.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {calculations.riskRewardRatio > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Risk Assessment</h3>
              <p className="text-sm text-blue-700">
                {calculations.riskRewardRatio >= 2 
                  ? "✅ Good risk/reward ratio. This trade has favorable potential."
                  : calculations.riskRewardRatio >= 1
                  ? "⚠️ Acceptable risk/reward ratio. Consider if this fits your strategy."
                  : "❌ Poor risk/reward ratio. Consider adjusting your targets."
                }
              </p>
            </div>
          )}
          {calculations.riskRewardRatio > 0 && (
            <div className="mt-4">
              <RiskRewardChart
                riskAmount={calculations.riskAmount}
                potentialProfit={calculations.potentialProfit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingRiskCalculator;