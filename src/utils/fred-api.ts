// FRED (Federal Reserve Economic Data) API Integration
// St. Louis Fed API - Free to use, no API key required for basic access

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
// Note: For production use, you should use an API key
export async function fetchFREDSeries(
  seriesId: string,
  startDate?: string,
  limit: number = 30
): Promise<FREDSeriesData> {
  // Using a CORS proxy for browser requests
  // In production, this should be done server-side
  const proxyUrl = 'https://api.allorigins.win/raw?url=';

  let url = `${FRED_BASE_URL}/series/observations?series_id=${seriesId}&file_type=json&sort_order=desc&limit=${limit}`;

  if (startDate) {
    url += `&observation_start=${startDate}`;
  }

  try {
    const response = await fetch(proxyUrl + encodeURIComponent(url));

    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status}`);
    }

    const data = await response.json();

    const observations = data.observations
      .filter((obs: FREDObservation) => obs.value !== '.')
      .map((obs: FREDObservation) => ({
        date: obs.date,
        value: parseFloat(obs.value),
      }))
      .reverse(); // Chronological order

    return {
      seriesId,
      title: getSeriesTitle(seriesId),
      observations,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching FRED series ${seriesId}:`, error);
    throw error;
  }
}

// Get current treasury yield curve
export async function fetchYieldCurve(): Promise<YieldCurvePoint[]> {
  const maturities = [
    { id: TREASURY_SERIES.DGS1MO, years: 1/12, label: '1M' },
    { id: TREASURY_SERIES.DGS3MO, years: 0.25, label: '3M' },
    { id: TREASURY_SERIES.DGS6MO, years: 0.5, label: '6M' },
    { id: TREASURY_SERIES.DGS1, years: 1, label: '1Y' },
    { id: TREASURY_SERIES.DGS2, years: 2, label: '2Y' },
    { id: TREASURY_SERIES.DGS3, years: 3, label: '3Y' },
    { id: TREASURY_SERIES.DGS5, years: 5, label: '5Y' },
    { id: TREASURY_SERIES.DGS7, years: 7, label: '7Y' },
    { id: TREASURY_SERIES.DGS10, years: 10, label: '10Y' },
    { id: TREASURY_SERIES.DGS20, years: 20, label: '20Y' },
    { id: TREASURY_SERIES.DGS30, years: 30, label: '30Y' },
  ];

  const yieldCurve: YieldCurvePoint[] = [];

  // Fetch all series in parallel
  const promises = maturities.map(async (maturity) => {
    try {
      const data = await fetchFREDSeries(maturity.id, undefined, 1);
      if (data.observations.length > 0) {
        return {
          maturity: maturity.label,
          years: maturity.years,
          rate: data.observations[data.observations.length - 1].value,
        };
      }
    } catch {
      console.warn(`Failed to fetch ${maturity.id}`);
    }
    return null;
  });

  const results = await Promise.all(promises);

  for (const result of results) {
    if (result) {
      yieldCurve.push(result);
    }
  }

  return yieldCurve.sort((a, b) => a.years - b.years);
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

// Sample/Mock data for when API is unavailable
export function getMockYieldCurve(): YieldCurvePoint[] {
  return [
    { maturity: '1M', years: 1/12, rate: 5.32 },
    { maturity: '3M', years: 0.25, rate: 5.24 },
    { maturity: '6M', years: 0.5, rate: 5.08 },
    { maturity: '1Y', years: 1, rate: 4.72 },
    { maturity: '2Y', years: 2, rate: 4.25 },
    { maturity: '3Y', years: 3, rate: 4.10 },
    { maturity: '5Y', years: 5, rate: 4.05 },
    { maturity: '7Y', years: 7, rate: 4.12 },
    { maturity: '10Y', years: 10, rate: 4.22 },
    { maturity: '20Y', years: 20, rate: 4.52 },
    { maturity: '30Y', years: 30, rate: 4.42 },
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
  // Sample historical data
  return [
    { date: '2024-01', '2Y': 4.21, '10Y': 3.95, '30Y': 4.12, spread: -0.26 },
    { date: '2024-02', '2Y': 4.43, '10Y': 4.10, '30Y': 4.25, spread: -0.33 },
    { date: '2024-03', '2Y': 4.59, '10Y': 4.20, '30Y': 4.34, spread: -0.39 },
    { date: '2024-04', '2Y': 4.72, '10Y': 4.35, '30Y': 4.48, spread: -0.37 },
    { date: '2024-05', '2Y': 4.87, '10Y': 4.42, '30Y': 4.54, spread: -0.45 },
    { date: '2024-06', '2Y': 4.71, '10Y': 4.28, '30Y': 4.43, spread: -0.43 },
    { date: '2024-07', '2Y': 4.51, '10Y': 4.18, '30Y': 4.38, spread: -0.33 },
    { date: '2024-08', '2Y': 4.38, '10Y': 4.02, '30Y': 4.26, spread: -0.36 },
    { date: '2024-09', '2Y': 4.25, '10Y': 4.22, '30Y': 4.42, spread: -0.03 },
    { date: '2024-10', '2Y': 4.18, '10Y': 4.28, '30Y': 4.48, spread: 0.10 },
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
