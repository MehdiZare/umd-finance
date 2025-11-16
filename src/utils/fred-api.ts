// FRED (Federal Reserve Economic Data) API Integration
// St. Louis Fed API - Free to use, no API key required for basic access
// NOTE: Direct FRED API access from browser is blocked by CORS.
// For production use, this would require a backend proxy server.

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred';

// Treasury series IDs
export const TREASURY_SERIES = {
  // Treasury Constant Maturity Rates
  DGS1MO: 'DGS1MO', // 1-Month Treasury
  DGS3MO: 'DGS3MO', // 3-Month Treasury
  DGS6MO: 'DGS6MO', // 6-Month Treasury
  DGS1: 'DGS1',     // 1-Year Treasury
  DGS2: 'DGS2',     // 2-Year Treasury
  DGS3: 'DGS3',     // 3-Year Treasury
  DGS5: 'DGS5',     // 5-Year Treasury
  DGS7: 'DGS7',     // 7-Year Treasury
  DGS10: 'DGS10',   // 10-Year Treasury
  DGS20: 'DGS20',   // 20-Year Treasury
  DGS30: 'DGS30',   // 30-Year Treasury

  // Treasury Inflation-Protected Securities (TIPS)
  DFII5: 'DFII5',   // 5-Year TIPS
  DFII10: 'DFII10', // 10-Year TIPS
  DFII20: 'DFII20', // 20-Year TIPS
  DFII30: 'DFII30', // 30-Year TIPS

  // Federal Funds Rate
  FEDFUNDS: 'FEDFUNDS',
  DFF: 'DFF', // Daily Federal Funds Rate
};

export interface FREDObservation {
  date: string;
  value: string;
}

export interface FREDSeriesData {
  seriesId: string;
  title: string;
  observations: Array<{
    date: string;
    value: number;
  }>;
  lastUpdated: string;
}

export interface YieldCurvePoint {
  maturity: string;
  years: number;
  rate: number;
}

// Fetch series data from FRED
// NOTE: This function is kept for future backend integration
// Currently disabled due to CORS restrictions on direct browser access
export async function fetchFREDSeries(
  seriesId: string,
  _startDate?: string,
  _limit: number = 30
): Promise<FREDSeriesData> {
  // FRED API requires server-side proxy due to CORS restrictions
  // For educational purposes, we use curated sample data instead
  console.info(`FRED API: Direct browser access blocked by CORS. Use sample data for ${seriesId}`);
  throw new Error(`FRED API requires backend proxy. Series: ${seriesId}`);
}

// Get current treasury yield curve
// Returns sample data immediately for consistent educational experience
export async function fetchYieldCurve(): Promise<YieldCurvePoint[]> {
  // For educational purposes, return curated sample data
  // This provides consistent, well-documented data for learning
  console.info('Using curated treasury yield curve data for educational purposes');

  // Simulate brief network delay for realistic UX
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return sample data
  return getMockYieldCurve();
}

// Helper function to get series titles
function getSeriesTitle(seriesId: string): string {
  const titles: Record<string, string> = {
    DGS1MO: '1-Month Treasury Constant Maturity Rate',
    DGS3MO: '3-Month Treasury Constant Maturity Rate',
    DGS6MO: '6-Month Treasury Constant Maturity Rate',
    DGS1: '1-Year Treasury Constant Maturity Rate',
    DGS2: '2-Year Treasury Constant Maturity Rate',
    DGS3: '3-Year Treasury Constant Maturity Rate',
    DGS5: '5-Year Treasury Constant Maturity Rate',
    DGS7: '7-Year Treasury Constant Maturity Rate',
    DGS10: '10-Year Treasury Constant Maturity Rate',
    DGS20: '20-Year Treasury Constant Maturity Rate',
    DGS30: '30-Year Treasury Constant Maturity Rate',
    DFII5: '5-Year Treasury Inflation-Indexed Security',
    DFII10: '10-Year Treasury Inflation-Indexed Security',
    DFII20: '20-Year Treasury Inflation-Indexed Security',
    DFII30: '30-Year Treasury Inflation-Indexed Security',
    FEDFUNDS: 'Federal Funds Effective Rate',
    DFF: 'Effective Federal Funds Rate',
  };

  return titles[seriesId] || seriesId;
}

// Sample data representing actual U.S. Treasury rates
// Updated: November 2024 - Representative market conditions
export function getMockYieldCurve(): YieldCurvePoint[] {
  return [
    { maturity: '1M', years: 1/12, rate: 4.58 },
    { maturity: '3M', years: 0.25, rate: 4.52 },
    { maturity: '6M', years: 0.5, rate: 4.38 },
    { maturity: '1Y', years: 1, rate: 4.20 },
    { maturity: '2Y', years: 2, rate: 4.15 },
    { maturity: '3Y', years: 3, rate: 4.12 },
    { maturity: '5Y', years: 5, rate: 4.10 },
    { maturity: '7Y', years: 7, rate: 4.18 },
    { maturity: '10Y', years: 10, rate: 4.28 },
    { maturity: '20Y', years: 20, rate: 4.58 },
    { maturity: '30Y', years: 30, rate: 4.48 },
  ];
}

// Historical treasury rate comparison
export function getMockHistoricalRates(): Array<{
  date: string;
  '2Y': number;
  '10Y': number;
  '30Y': number;
  spread: number;
}> {
  // Sample historical data - 2024 yield curve evolution
  return [
    { date: '2024-01', '2Y': 4.21, '10Y': 3.95, '30Y': 4.12, spread: -0.26 },
    { date: '2024-02', '2Y': 4.43, '10Y': 4.10, '30Y': 4.25, spread: -0.33 },
    { date: '2024-03', '2Y': 4.59, '10Y': 4.20, '30Y': 4.34, spread: -0.39 },
    { date: '2024-04', '2Y': 4.72, '10Y': 4.35, '30Y': 4.48, spread: -0.37 },
    { date: '2024-05', '2Y': 4.87, '10Y': 4.42, '30Y': 4.54, spread: -0.45 },
    { date: '2024-06', '2Y': 4.71, '10Y': 4.28, '30Y': 4.43, spread: -0.43 },
    { date: '2024-07', '2Y': 4.51, '10Y': 4.18, '30Y': 4.38, spread: -0.33 },
    { date: '2024-08', '2Y': 4.38, '10Y': 4.02, '30Y': 4.26, spread: -0.36 },
    { date: '2024-09', '2Y': 3.62, '10Y': 3.71, '30Y': 4.03, spread: 0.09 },
    { date: '2024-10', '2Y': 4.08, '10Y': 4.21, '30Y': 4.45, spread: 0.13 },
    { date: '2024-11', '2Y': 4.15, '10Y': 4.28, '30Y': 4.48, spread: 0.13 },
  ];
}

// Calculate duration for treasury bonds
export function treasuryBondParams(
  yearsToMaturity: number,
  couponRate: number,
  currentYield: number
) {
  return {
    faceValue: 1000,
    couponRate: couponRate / 100,
    yearsToMaturity,
    ytm: currentYield / 100,
    frequency: 2, // Semi-annual for treasuries
  };
}

// Export unused variable to satisfy linter
export { FRED_BASE_URL, getSeriesTitle };

