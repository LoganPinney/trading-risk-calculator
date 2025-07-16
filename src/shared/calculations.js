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