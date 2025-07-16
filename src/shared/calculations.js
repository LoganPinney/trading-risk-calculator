/**
 * Trading Risk Calculator Utilities
 * Contains pure functions for risk calculations
 */

export const calculateRiskMetrics = (params) => {
  const {
    startingCapital,
    riskTolerance,
    dailyMaxLoss,
    weeklyMaxLoss,
    sharePrice,
    numShares,
    profitTargetPerShare
  } = params;

// Validate inputs before proceeding with calculations
  const required = [
    startingCapital,
    riskTolerance,
    dailyMaxLoss,
    weeklyMaxLoss,
    sharePrice,
    numShares,
    profitTargetPerShare
  ];
  if (required.some(v => typeof v !== 'number' || Number.isNaN(v))) {
    throw new Error('Invalid calculation parameters');
  }

  if (
    startingCapital <= 0 ||
    sharePrice <= 0 ||
    numShares <= 0 ||
    profitTargetPerShare <= 0 ||
    riskTolerance < 0 ||
    riskTolerance > 100 ||
    dailyMaxLoss < 0 ||
    dailyMaxLoss > 100 ||
    weeklyMaxLoss < 0 ||
    weeklyMaxLoss > 100
  ) {
    throw new Error('Invalid calculation parameters');
  }

  // Basic calculations
  const shareSize = sharePrice * numShares;
  const riskPerTrade = (startingCapital * riskTolerance) / 100;
  const dailyMaxLossAmount = (startingCapital * dailyMaxLoss) / 100;
  const weeklyMaxLossAmount = (startingCapital * weeklyMaxLoss) / 100;
  const totalPotentialProfit = numShares * profitTargetPerShare;
  const totalPotentialLoss = Math.min(shareSize, riskPerTrade);
  
  // Risk-to-reward ratio
  const riskRewardRatio = totalPotentialLoss > 0 ? totalPotentialProfit / totalPotentialLoss : 0;
  
  // How many trades can fit in daily/weekly limits
  const tradesPerDay = totalPotentialLoss > 0 ? Math.floor(dailyMaxLossAmount / totalPotentialLoss) : 0;
  const tradesPerWeek = totalPotentialLoss > 0 ? Math.floor(weeklyMaxLossAmount / totalPotentialLoss) : 0;
  
  // Risk as percentage of capital
  const riskPercentOfCapital = (totalPotentialLoss / startingCapital) * 100;

  return {
    shareSize,
    riskPerTrade,
    dailyMaxLossAmount,
    weeklyMaxLossAmount,
    totalPotentialProfit,
    totalPotentialLoss,
    riskRewardRatio,
    tradesPerDay,
    tradesPerWeek,
    riskPercentOfCapital
  };
};

export const generateChartData = (params) => {
  const data = [];
  
  // Generate data points for different share quantities
  for (let i = 0; i <= 200; i += 10) {
    const shares = i;
    const shareSize = params.sharePrice * shares;
    const potentialProfit = shares * params.profitTargetPerShare;
    const potentialLoss = Math.min(shareSize, (params.startingCapital * params.riskTolerance) / 100);
    
    data.push({
      shares,
      shareSize,
      potentialProfit,
      potentialLoss,
      riskPercent: (potentialLoss / params.startingCapital) * 100
    });
  }
  
  return data;
};

export const validateParams = (params) => {
  const errors = [];
  
  if (params.startingCapital <= 0) {
    errors.push('Starting capital must be greater than 0');
  }
  
  if (params.riskTolerance <= 0 || params.riskTolerance > 100) {
    errors.push('Risk tolerance must be between 0 and 100%');
  }
  
  if (params.dailyMaxLoss <= 0 || params.dailyMaxLoss > 100) {
    errors.push('Daily max loss must be between 0 and 100%');
  }
  
  if (params.weeklyMaxLoss <= 0 || params.weeklyMaxLoss > 100) {
    errors.push('Weekly max loss must be between 0 and 100%');
  }
  
  if (params.sharePrice <= 0) {
    errors.push('Share price must be greater than 0');
  }
  
  if (params.numShares <= 0) {
    errors.push('Number of shares must be greater than 0');
  }
  
  if (params.profitTargetPerShare <= 0) {
    errors.push('Profit target per share must be greater than 0');
  }
  
  return errors;
};
// === Additional helpers used by the React calculator ===

/**
 * Calculate the dollar amount at risk for a single trade.
 * Formula: (account balance * risk percent) / 100
 */
export const calculateRiskAmount = (balance, riskPercent) => (balance * riskPercent) / 100;

/**
 * Determine the distance between entry and stop price depending on position type.
 */
export const calculateStopLossDistance = (entry, stop, type) =>
  type === 'long' ? entry - stop : stop - entry;

/**
 * Determine the distance to the take profit price if provided.
 */
export const calculateTakeProfitDistance = (entry, takeProfit, type) => {
  if (!takeProfit) return 0;
  return type === 'long' ? takeProfit - entry : entry - takeProfit;
};

/**
 * Calculate position size while guarding against division by zero.
 */
export const calculatePositionSize = (riskAmount, stopLossDistance) =>
  stopLossDistance > 0 ? riskAmount / stopLossDistance : 0;

/**
 * Calculate potential profit using position size and take profit distance.
 */
export const calculatePotentialProfit = (positionSize, takeProfitDistance) =>
  takeProfitDistance > 0 ? positionSize * takeProfitDistance : 0;

/**
 * Compute risk/reward ratio. Returns 0 when either value is not positive.
 */
export const calculateRiskRewardRatio = (potentialProfit, riskAmount) =>
  riskAmount > 0 && potentialProfit > 0 ? potentialProfit / riskAmount : 0;
