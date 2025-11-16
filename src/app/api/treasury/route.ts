// API Route for fetching FRED Treasury data server-side
// This solves CORS issues by making the request from the server

import { NextResponse } from 'next/server'

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred'

// FRED API key - obtain free at https://fred.stlouisfed.org/docs/api/api_key.html
// Set FRED_API_KEY environment variable in Render dashboard
const FRED_API_KEY = process.env.FRED_API_KEY || ''

// Treasury series IDs for the yield curve
const TREASURY_SERIES = {
  DGS1MO: '1M',
  DGS3MO: '3M',
  DGS6MO: '6M',
  DGS1: '1Y',
  DGS2: '2Y',
  DGS3: '3Y',
  DGS5: '5Y',
  DGS7: '7Y',
  DGS10: '10Y',
  DGS20: '20Y',
  DGS30: '30Y',
}

// Additional economic indicators
const ADDITIONAL_SERIES = {
  DFF: 'Federal Funds Effective Rate',
  DFII5: '5-Year TIPS',
  DFII10: '10-Year TIPS',
  DFII30: '30-Year TIPS',
  T5YIE: '5-Year Breakeven Inflation',
  T10YIE: '10-Year Breakeven Inflation',
  T30YIEM: '30-Year Breakeven Inflation',
  BAMLC0A0CM: 'Investment Grade Corporate Spread',
  BAMLH0A0HYM2: 'High Yield Corporate Spread',
}

const MATURITY_YEARS: Record<string, number> = {
  '1M': 1 / 12,
  '3M': 0.25,
  '6M': 0.5,
  '1Y': 1,
  '2Y': 2,
  '3Y': 3,
  '5Y': 5,
  '7Y': 7,
  '10Y': 10,
  '20Y': 20,
  '30Y': 30,
}

// FRED series page URLs for attribution
const FRED_SERIES_URLS: Record<string, string> = {
  DGS1MO: 'https://fred.stlouisfed.org/series/DGS1MO',
  DGS3MO: 'https://fred.stlouisfed.org/series/DGS3MO',
  DGS6MO: 'https://fred.stlouisfed.org/series/DGS6MO',
  DGS1: 'https://fred.stlouisfed.org/series/DGS1',
  DGS2: 'https://fred.stlouisfed.org/series/DGS2',
  DGS3: 'https://fred.stlouisfed.org/series/DGS3',
  DGS5: 'https://fred.stlouisfed.org/series/DGS5',
  DGS7: 'https://fred.stlouisfed.org/series/DGS7',
  DGS10: 'https://fred.stlouisfed.org/series/DGS10',
  DGS20: 'https://fred.stlouisfed.org/series/DGS20',
  DGS30: 'https://fred.stlouisfed.org/series/DGS30',
  DFF: 'https://fred.stlouisfed.org/series/DFF',
  DFII5: 'https://fred.stlouisfed.org/series/DFII5',
  DFII10: 'https://fred.stlouisfed.org/series/DFII10',
  DFII30: 'https://fred.stlouisfed.org/series/DFII30',
  T5YIE: 'https://fred.stlouisfed.org/series/T5YIE',
  T10YIE: 'https://fred.stlouisfed.org/series/T10YIE',
  T30YIEM: 'https://fred.stlouisfed.org/series/T30YIEM',
  BAMLC0A0CM: 'https://fred.stlouisfed.org/series/BAMLC0A0CM',
  BAMLH0A0HYM2: 'https://fred.stlouisfed.org/series/BAMLH0A0HYM2',
}

interface YieldCurvePoint {
  maturity: string
  years: number
  rate: number
}

interface AdditionalIndicator {
  seriesId: string
  name: string
  value: number
  unit: string
  url: string
}

async function fetchSingleSeries(seriesId: string): Promise<number | null> {
  if (!FRED_API_KEY) {
    return null // No API key configured
  }

  try {
    const url = `${FRED_BASE_URL}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=1`

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`FRED API error for ${seriesId}: ${response.status}`)
      return null
    }

    const data = await response.json()

    if (!data.observations || data.observations.length === 0) {
      return null
    }

    const value = parseFloat(data.observations[0].value)
    return isNaN(value) ? null : value
  } catch (error) {
    console.error(`Error fetching ${seriesId}:`, error)
    return null
  }
}

export async function GET() {
  // If no API key is configured, return sample data
  if (!FRED_API_KEY) {
    console.info('No FRED_API_KEY configured. Using sample data.')
    return NextResponse.json({
      data: getSampleYieldCurve(),
      additionalIndicators: [],
      seriesUrls: {},
      source: 'Sample Data (No API Key)',
      timestamp: new Date().toISOString(),
      message: 'Set FRED_API_KEY environment variable for live data. Get free key at https://fred.stlouisfed.org/docs/api/api_key.html',
    })
  }

  try {
    const yieldCurve: YieldCurvePoint[] = []
    const additionalIndicators: AdditionalIndicator[] = []
    const errors: string[] = []

    // Fetch treasury series
    const treasuryEntries = Object.entries(TREASURY_SERIES)
    const treasuryResults = await Promise.all(
      treasuryEntries.map(([seriesId]) => fetchSingleSeries(seriesId))
    )

    // Process treasury results
    for (let i = 0; i < treasuryEntries.length; i++) {
      const [seriesId, maturityLabel] = treasuryEntries[i]
      const rate = treasuryResults[i]

      if (rate !== null) {
        yieldCurve.push({
          maturity: maturityLabel,
          years: MATURITY_YEARS[maturityLabel],
          rate: rate,
        })
      } else {
        errors.push(seriesId)
      }
    }

    // Fetch additional indicators
    const additionalEntries = Object.entries(ADDITIONAL_SERIES)
    const additionalResults = await Promise.all(
      additionalEntries.map(([seriesId]) => fetchSingleSeries(seriesId))
    )

    // Process additional indicators
    for (let i = 0; i < additionalEntries.length; i++) {
      const [seriesId, name] = additionalEntries[i]
      const value = additionalResults[i]

      if (value !== null) {
        additionalIndicators.push({
          seriesId,
          name,
          value,
          unit: seriesId.includes('BAML') ? 'bps' : '%',
          url: FRED_SERIES_URLS[seriesId],
        })
      }
    }

    // Sort yield curve by years to maturity
    yieldCurve.sort((a, b) => a.years - b.years)

    if (yieldCurve.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to fetch any treasury data',
          details: errors,
        },
        { status: 500 }
      )
    }

    // Build series URLs map for attribution
    const seriesUrls: Record<string, string> = {}
    for (const [seriesId] of treasuryEntries) {
      seriesUrls[seriesId] = FRED_SERIES_URLS[seriesId]
    }

    return NextResponse.json({
      data: yieldCurve,
      additionalIndicators,
      seriesUrls,
      source: 'FRED API (Live)',
      timestamp: new Date().toISOString(),
      missing: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Treasury API route error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error fetching treasury data',
      },
      { status: 500 }
    )
  }
}

// Sample yield curve data (November 2024 representative rates)
function getSampleYieldCurve(): YieldCurvePoint[] {
  return [
    { maturity: '1M', years: 1 / 12, rate: 4.58 },
    { maturity: '3M', years: 0.25, rate: 4.52 },
    { maturity: '6M', years: 0.5, rate: 4.38 },
    { maturity: '1Y', years: 1, rate: 4.2 },
    { maturity: '2Y', years: 2, rate: 4.15 },
    { maturity: '3Y', years: 3, rate: 4.12 },
    { maturity: '5Y', years: 5, rate: 4.1 },
    { maturity: '7Y', years: 7, rate: 4.18 },
    { maturity: '10Y', years: 10, rate: 4.28 },
    { maturity: '20Y', years: 20, rate: 4.58 },
    { maturity: '30Y', years: 30, rate: 4.48 },
  ]
}
