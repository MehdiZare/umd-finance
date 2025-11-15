// Bond/Loan Duration Calculator Utilities
// For educational purposes - Master of Finance students

export interface BondParams {
  faceValue: number;
  couponRate: number; // Annual coupon rate as decimal (e.g., 0.05 for 5%)
  yearsToMaturity: number;
  ytm: number; // Yield to maturity as decimal
  frequency: number; // Payments per year (1=annual, 2=semi-annual, 4=quarterly)
}

export interface CashFlow {
  period: number;
  time: number; // Time in years
  payment: number;
  presentValue: number;
  weightedPV: number; // time * PV for Macaulay duration
}

export interface DurationResults {
  price: number;
  macaulayDuration: number;
  modifiedDuration: number;
  dollarDuration: number;
  convexity: number;
  cashFlows: CashFlow[];
}

// Calculate bond price
export function calculateBondPrice(params: BondParams): number {
  const { faceValue, couponRate, yearsToMaturity, ytm, frequency } = params;
  const periodicCoupon = (faceValue * couponRate) / frequency;
  const periodicYTM = ytm / frequency;
  const totalPeriods = yearsToMaturity * frequency;

  let price = 0;

  // Present value of coupon payments
  for (let t = 1; t <= totalPeriods; t++) {
    price += periodicCoupon / Math.pow(1 + periodicYTM, t);
  }

  // Present value of face value
  price += faceValue / Math.pow(1 + periodicYTM, totalPeriods);

  return price;
}

// Calculate all duration metrics
export function calculateDuration(params: BondParams): DurationResults {
  const { faceValue, couponRate, yearsToMaturity, ytm, frequency } = params;
  const periodicCoupon = (faceValue * couponRate) / frequency;
  const periodicYTM = ytm / frequency;
  const totalPeriods = yearsToMaturity * frequency;

  const cashFlows: CashFlow[] = [];
  let price = 0;
  let weightedPVSum = 0;
  let convexitySum = 0;

  // Calculate cash flows and their present values
  for (let t = 1; t <= totalPeriods; t++) {
    const timeInYears = t / frequency;
    const payment = t === totalPeriods ? periodicCoupon + faceValue : periodicCoupon;
    const discountFactor = Math.pow(1 + periodicYTM, t);
    const pv = payment / discountFactor;
    const weightedPV = timeInYears * pv;

    cashFlows.push({
      period: t,
      time: timeInYears,
      payment,
      presentValue: pv,
      weightedPV,
    });

    price += pv;
    weightedPVSum += weightedPV;

    // For convexity calculation
    convexitySum += (timeInYears * (timeInYears + 1 / frequency) * pv);
  }

  // Macaulay Duration (in years)
  const macaulayDuration = weightedPVSum / price;

  // Modified Duration = Macaulay Duration / (1 + y/k)
  const modifiedDuration = macaulayDuration / (1 + periodicYTM);

  // Dollar Duration (DV01) = Modified Duration * Price / 100
  const dollarDuration = modifiedDuration * price / 100;

  // Convexity
  const convexity = convexitySum / (price * Math.pow(1 + periodicYTM, 2));

  return {
    price,
    macaulayDuration,
    modifiedDuration,
    dollarDuration,
    convexity,
    cashFlows,
  };
}

// Calculate price change for a given yield change
export function calculatePriceChange(
  params: BondParams,
  yieldChangeBps: number // Change in basis points
): { newPrice: number; percentChange: number; dollarChange: number; durationApprox: number; withConvexity: number } {
  const results = calculateDuration(params);
  const yieldChange = yieldChangeBps / 10000; // Convert bps to decimal

  // New price with actual calculation
  const newParams = { ...params, ytm: params.ytm + yieldChange };
  const newPrice = calculateBondPrice(newParams);

  // Approximation using modified duration only
  const durationApprox = results.price * (-results.modifiedDuration * yieldChange);

  // Approximation using duration and convexity
  const withConvexity =
    results.price *
    (-results.modifiedDuration * yieldChange +
      0.5 * results.convexity * Math.pow(yieldChange, 2));

  const dollarChange = newPrice - results.price;
  const percentChange = (dollarChange / results.price) * 100;

  return {
    newPrice,
    percentChange,
    dollarChange,
    durationApprox,
    withConvexity,
  };
}

// Generate price-yield curve data
export function generatePriceYieldCurve(
  params: BondParams,
  yieldRange: number = 0.04 // +/- 4% from current YTM
): Array<{ yield: number; price: number; durationApproxPrice: number }> {
  const results = calculateDuration(params);
  const data: Array<{ yield: number; price: number; durationApproxPrice: number }> = [];

  const steps = 50;
  const minYield = Math.max(0.001, params.ytm - yieldRange);
  const maxYield = params.ytm + yieldRange;
  const stepSize = (maxYield - minYield) / steps;

  for (let i = 0; i <= steps; i++) {
    const newYtm = minYield + i * stepSize;
    const newPrice = calculateBondPrice({ ...params, ytm: newYtm });
    const yieldChange = newYtm - params.ytm;

    // Duration approximation (linear)
    const durationApproxPrice =
      results.price * (1 - results.modifiedDuration * yieldChange);

    data.push({
      yield: newYtm * 100, // Convert to percentage
      price: newPrice,
      durationApproxPrice,
    });
  }

  return data;
}

// Compare bonds with different characteristics
export function compareBonds(bonds: BondParams[]): DurationResults[] {
  return bonds.map(calculateDuration);
}

// Key Rate Duration (simplified - assumes parallel shift)
export function calculateKeyRateDuration(
  params: BondParams,
  _keyRate: number // The maturity point being shocked (for future implementation)
): number {
  const bumpSize = 0.0001; // 1 basis point

  // Shock the yield at key rate
  const priceUp = calculateBondPrice({ ...params, ytm: params.ytm + bumpSize });
  const priceDown = calculateBondPrice({ ...params, ytm: params.ytm - bumpSize });
  const basePrice = calculateBondPrice(params);

  return -(priceUp - priceDown) / (2 * bumpSize * basePrice);
}

// Calculate Effective Duration (for option-embedded bonds)
export function calculateEffectiveDuration(
  params: BondParams,
  bumpSize: number = 0.01 // 100 bps
): number {
  const priceUp = calculateBondPrice({ ...params, ytm: params.ytm + bumpSize });
  const priceDown = calculateBondPrice({ ...params, ytm: params.ytm - bumpSize });
  const basePrice = calculateBondPrice(params);

  return (priceDown - priceUp) / (2 * bumpSize * basePrice);
}

// Portfolio Duration
export function calculatePortfolioDuration(
  bonds: Array<{ params: BondParams; weight: number }>
): number {
  let portfolioDuration = 0;

  for (const bond of bonds) {
    const results = calculateDuration(bond.params);
    portfolioDuration += bond.weight * results.modifiedDuration;
  }

  return portfolioDuration;
}

// Zero-coupon bond duration (always equals maturity)
export function calculateZeroCouponDuration(yearsToMaturity: number): {
  macaulay: number;
  modified: number;
  ytm: number;
} {
  return {
    macaulay: yearsToMaturity,
    modified: yearsToMaturity, // Simplified for zero-coupon
    ytm: 0, // Placeholder
  };
}

// Duration gap analysis (for interest rate risk)
export function calculateDurationGap(
  assetsDuration: number,
  liabilitiesDuration: number,
  assetsValue: number,
  liabilitiesValue: number
): number {
  const leverageRatio = liabilitiesValue / assetsValue;
  return assetsDuration - leverageRatio * liabilitiesDuration;
}

// Immunization target duration
export function calculateImmunizationDuration(
  targetHorizon: number,
  currentDuration: number
): { isImmunized: boolean; durationGap: number } {
  const gap = currentDuration - targetHorizon;
  return {
    isImmunized: Math.abs(gap) < 0.1, // Within 0.1 years
    durationGap: gap,
  };
}
