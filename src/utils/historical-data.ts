// Historical yield curve data for animation
// Data represents actual U.S. Treasury rates during significant periods

export interface HistoricalYieldCurve {
  date: string;
  description: string;
  event: string;
  curves: {
    maturity: string;
    years: number;
    rate: number;
  }[];
}

export const historicalYieldCurves: HistoricalYieldCurve[] = [
  // Earlier historical events for context
  {
    date: '2000-01-03',
    description: 'Dot-Com Peak',
    event: 'Tech bubble peak, Y2K fears subsided, Fed tightening cycle',
    curves: [
      { maturity: '3M', years: 0.25, rate: 5.46 },
      { maturity: '1Y', years: 1, rate: 6.12 },
      { maturity: '2Y', years: 2, rate: 6.54 },
      { maturity: '5Y', years: 5, rate: 6.58 },
      { maturity: '10Y', years: 10, rate: 6.58 },
      { maturity: '30Y', years: 30, rate: 6.48 },
    ],
  },
  {
    date: '2001-09-17',
    description: 'Post-9/11 Crisis',
    event: 'First trading day after September 11 attacks, Fed emergency cuts',
    curves: [
      { maturity: '3M', years: 0.25, rate: 2.90 },
      { maturity: '1Y', years: 1, rate: 2.89 },
      { maturity: '2Y', years: 2, rate: 3.20 },
      { maturity: '5Y', years: 5, rate: 4.18 },
      { maturity: '10Y', years: 10, rate: 4.83 },
      { maturity: '30Y', years: 30, rate: 5.47 },
    ],
  },
  {
    date: '2003-06-25',
    description: 'Fed Funds 1% Bottom',
    event: 'Fed cuts to 1%, lowest in 45 years, deflation fears',
    curves: [
      { maturity: '3M', years: 0.25, rate: 0.92 },
      { maturity: '1Y', years: 1, rate: 1.08 },
      { maturity: '2Y', years: 2, rate: 1.39 },
      { maturity: '5Y', years: 5, rate: 2.84 },
      { maturity: '10Y', years: 10, rate: 3.58 },
      { maturity: '30Y', years: 30, rate: 4.56 },
    ],
  },
  {
    date: '2006-06-29',
    description: 'Fed Ends Tightening',
    event: 'Fed Funds peak at 5.25%, 17 consecutive hikes complete',
    curves: [
      { maturity: '3M', years: 0.25, rate: 5.11 },
      { maturity: '1Y', years: 1, rate: 5.22 },
      { maturity: '2Y', years: 2, rate: 5.18 },
      { maturity: '5Y', years: 5, rate: 5.15 },
      { maturity: '10Y', years: 10, rate: 5.24 },
      { maturity: '30Y', years: 30, rate: 5.20 },
    ],
  },
  {
    date: '2007-06-01',
    description: 'Pre-Financial Crisis',
    event: 'Housing market peak, before subprime mortgage crisis',
    curves: [
      { maturity: '3M', years: 0.25, rate: 4.82 },
      { maturity: '1Y', years: 1, rate: 4.94 },
      { maturity: '2Y', years: 2, rate: 4.87 },
      { maturity: '5Y', years: 5, rate: 4.86 },
      { maturity: '10Y', years: 10, rate: 5.03 },
      { maturity: '30Y', years: 30, rate: 5.07 },
    ],
  },
  {
    date: '2008-09-15',
    description: 'Lehman Brothers Collapse',
    event: 'Peak of financial crisis, flight to safety',
    curves: [
      { maturity: '3M', years: 0.25, rate: 1.62 },
      { maturity: '1Y', years: 1, rate: 1.96 },
      { maturity: '2Y', years: 2, rate: 2.15 },
      { maturity: '5Y', years: 5, rate: 3.05 },
      { maturity: '10Y', years: 10, rate: 3.72 },
      { maturity: '30Y', years: 30, rate: 4.21 },
    ],
  },
  {
    date: '2009-03-01',
    description: 'Crisis Bottom',
    event: 'Fed cuts rates to near zero, QE begins',
    curves: [
      { maturity: '3M', years: 0.25, rate: 0.25 },
      { maturity: '1Y', years: 1, rate: 0.58 },
      { maturity: '2Y', years: 2, rate: 0.98 },
      { maturity: '5Y', years: 5, rate: 1.90 },
      { maturity: '10Y', years: 10, rate: 2.87 },
      { maturity: '30Y', years: 30, rate: 3.62 },
    ],
  },
  {
    date: '2013-05-22',
    description: 'Taper Tantrum',
    event: 'Fed signals QE tapering, rates spike',
    curves: [
      { maturity: '3M', years: 0.25, rate: 0.03 },
      { maturity: '1Y', years: 1, rate: 0.13 },
      { maturity: '2Y', years: 2, rate: 0.29 },
      { maturity: '5Y', years: 5, rate: 1.13 },
      { maturity: '10Y', years: 10, rate: 2.01 },
      { maturity: '30Y', years: 30, rate: 3.17 },
    ],
  },
  {
    date: '2016-07-08',
    description: 'Post-Brexit Low',
    event: 'Global uncertainty pushes rates to record lows',
    curves: [
      { maturity: '3M', years: 0.25, rate: 0.29 },
      { maturity: '1Y', years: 1, rate: 0.49 },
      { maturity: '2Y', years: 2, rate: 0.59 },
      { maturity: '5Y', years: 5, rate: 1.00 },
      { maturity: '10Y', years: 10, rate: 1.37 },
      { maturity: '30Y', years: 30, rate: 2.13 },
    ],
  },
  {
    date: '2019-08-14',
    description: 'Yield Curve Inversion',
    event: '2Y-10Y spread inverts, recession signal',
    curves: [
      { maturity: '3M', years: 0.25, rate: 2.09 },
      { maturity: '1Y', years: 1, rate: 1.78 },
      { maturity: '2Y', years: 2, rate: 1.58 },
      { maturity: '5Y', years: 5, rate: 1.47 },
      { maturity: '10Y', years: 10, rate: 1.56 },
      { maturity: '30Y', years: 30, rate: 2.01 },
    ],
  },
  {
    date: '2020-03-09',
    description: 'COVID-19 Crisis',
    event: 'Pandemic panic, extreme flight to safety',
    curves: [
      { maturity: '3M', years: 0.25, rate: 0.50 },
      { maturity: '1Y', years: 1, rate: 0.49 },
      { maturity: '2Y', years: 2, rate: 0.50 },
      { maturity: '5Y', years: 5, rate: 0.61 },
      { maturity: '10Y', years: 10, rate: 0.54 },
      { maturity: '30Y', years: 30, rate: 1.03 },
    ],
  },
  {
    date: '2021-03-31',
    description: 'Recovery Steepening',
    event: 'Vaccine rollout, inflation expectations rise',
    curves: [
      { maturity: '3M', years: 0.25, rate: 0.01 },
      { maturity: '1Y', years: 1, rate: 0.07 },
      { maturity: '2Y', years: 2, rate: 0.16 },
      { maturity: '5Y', years: 5, rate: 0.94 },
      { maturity: '10Y', years: 10, rate: 1.74 },
      { maturity: '30Y', years: 30, rate: 2.41 },
    ],
  },
  {
    date: '2022-06-15',
    description: 'Fed Hiking Cycle',
    event: '75bp rate hike, aggressive inflation fight',
    curves: [
      { maturity: '3M', years: 0.25, rate: 1.58 },
      { maturity: '1Y', years: 1, rate: 2.79 },
      { maturity: '2Y', years: 2, rate: 3.37 },
      { maturity: '5Y', years: 5, rate: 3.48 },
      { maturity: '10Y', years: 10, rate: 3.47 },
      { maturity: '30Y', years: 30, rate: 3.44 },
    ],
  },
  {
    date: '2023-03-13',
    description: 'Bank Crisis',
    event: 'SVB collapse, flight to safety returns',
    curves: [
      { maturity: '3M', years: 0.25, rate: 4.81 },
      { maturity: '1Y', years: 1, rate: 4.64 },
      { maturity: '2Y', years: 2, rate: 4.01 },
      { maturity: '5Y', years: 5, rate: 3.57 },
      { maturity: '10Y', years: 10, rate: 3.55 },
      { maturity: '30Y', years: 30, rate: 3.72 },
    ],
  },
  {
    date: '2023-10-19',
    description: 'Higher for Longer',
    event: '10Y hits 5%, market pricing extended high rates',
    curves: [
      { maturity: '3M', years: 0.25, rate: 5.46 },
      { maturity: '1Y', years: 1, rate: 5.46 },
      { maturity: '2Y', years: 2, rate: 5.19 },
      { maturity: '5Y', years: 5, rate: 4.89 },
      { maturity: '10Y', years: 10, rate: 4.98 },
      { maturity: '30Y', years: 30, rate: 5.09 },
    ],
  },
  {
    date: '2024-09-18',
    description: 'Fed Pivot',
    event: 'First rate cut after hiking cycle',
    curves: [
      { maturity: '3M', years: 0.25, rate: 4.85 },
      { maturity: '1Y', years: 1, rate: 4.18 },
      { maturity: '2Y', years: 2, rate: 3.62 },
      { maturity: '5Y', years: 5, rate: 3.50 },
      { maturity: '10Y', years: 10, rate: 3.71 },
      { maturity: '30Y', years: 30, rate: 4.03 },
    ],
  },
];

// Calculate fixed income metrics for a given yield curve
export function calculateMetricsForCurve(curve: HistoricalYieldCurve['curves']) {
  // Find relevant rates
  const rate2Y = curve.find(c => c.maturity === '2Y')?.rate || 0;
  const rate5Y = curve.find(c => c.maturity === '5Y')?.rate || 0;
  const rate10Y = curve.find(c => c.maturity === '10Y')?.rate || 0;
  const rate30Y = curve.find(c => c.maturity === '30Y')?.rate || 0;

  // Calculate spreads
  const spread2Y10Y = rate10Y - rate2Y;
  const spread5Y30Y = rate30Y - rate5Y;

  // Calculate average duration for par bonds (simplified)
  // For a par bond, modified duration ≈ (1 - 1/(1+y)^n) / y
  const calcModDuration = (years: number, rate: number) => {
    const y = rate / 100;
    if (y === 0) return years;
    return (1 - Math.pow(1 + y / 2, -2 * years)) / (y / 2) / 2;
  };

  const duration2Y = calcModDuration(2, rate2Y);
  const duration5Y = calcModDuration(5, rate5Y);
  const duration10Y = calcModDuration(10, rate10Y);
  const duration30Y = calcModDuration(30, rate30Y);

  // Calculate convexity (simplified approximation)
  const calcConvexity = (years: number, rate: number) => {
    const y = rate / 100 / 2;
    const n = years * 2;
    if (y === 0) return years * (years + 0.5);
    return (2 / (y * y)) * (1 - 1 / Math.pow(1 + y, n) - n * y / Math.pow(1 + y, n + 1));
  };

  const convexity10Y = calcConvexity(10, rate10Y);
  const convexity30Y = calcConvexity(30, rate30Y);

  // DV01 per $100 face value
  const dv01_10Y = (duration10Y * 100) / 10000;
  const dv01_30Y = (duration30Y * 100) / 10000;

  return {
    spread2Y10Y,
    spread5Y30Y,
    duration2Y,
    duration5Y,
    duration10Y,
    duration30Y,
    convexity10Y,
    convexity30Y,
    dv01_10Y,
    dv01_30Y,
    avgRate: (rate2Y + rate5Y + rate10Y + rate30Y) / 4,
  };
}
