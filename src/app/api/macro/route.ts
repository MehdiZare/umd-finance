// API Route for macroeconomic indicators from FRED
// These help students understand the context for interest rate movements

import { NextResponse } from 'next/server'

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred'
const FRED_API_KEY = process.env.FRED_API_KEY || ''

// Key macroeconomic indicators
const MACRO_SERIES = {
  UNRATE: {
    name: 'Unemployment Rate',
    unit: '%',
    description: 'Civilian unemployment rate',
    url: 'https://fred.stlouisfed.org/series/UNRATE',
  },
  PCEPILFE: {
    name: 'Core PCE Inflation',
    unit: '% YoY',
    description: "Fed's preferred inflation measure (excludes food & energy)",
    url: 'https://fred.stlouisfed.org/series/PCEPILFE',
  },
  CPIAUCSL: {
    name: 'CPI (All Items)',
    unit: '% YoY',
    description: 'Consumer Price Index for all urban consumers',
    url: 'https://fred.stlouisfed.org/series/CPIAUCSL',
  },
  A191RL1Q225SBEA: {
    name: 'Real GDP Growth',
    unit: '% QoQ',
    description: 'Percent change in real GDP (annualized)',
    url: 'https://fred.stlouisfed.org/series/A191RL1Q225SBEA',
  },
  VIXCLS: {
    name: 'VIX Index',
    unit: 'Index',
    description: 'Market volatility expectation (fear gauge)',
    url: 'https://fred.stlouisfed.org/series/VIXCLS',
  },
  WALCL: {
    name: 'Fed Balance Sheet',
    unit: 'B USD',
    description: 'Total assets held by Federal Reserve',
    url: 'https://fred.stlouisfed.org/series/WALCL',
  },
  IORB: {
    name: 'Interest on Reserve Balances',
    unit: '%',
    description: 'Rate paid by Fed on bank reserves',
    url: 'https://fred.stlouisfed.org/series/IORB',
  },
  MORTGAGE30US: {
    name: '30-Year Mortgage Rate',
    unit: '%',
    description: 'Average mortgage rate (primary market)',
    url: 'https://fred.stlouisfed.org/series/MORTGAGE30US',
  },
}

interface MacroIndicator {
  seriesId: string
  name: string
  value: number
  unit: string
  description: string
  url: string
  date: string
}

async function fetchSingleSeries(
  seriesId: string
): Promise<{ value: number; date: string } | null> {
  if (!FRED_API_KEY) {
    return null
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

    const obs = data.observations[0]
    const value = parseFloat(obs.value)
    return isNaN(value) ? null : { value, date: obs.date }
  } catch (error) {
    console.error(`Error fetching ${seriesId}:`, error)
    return null
  }
}

export async function GET() {
  // If no API key, return sample data
  if (!FRED_API_KEY) {
    console.info('No FRED_API_KEY configured. Using sample macro data.')
    return NextResponse.json({
      data: getSampleMacroData(),
      source: 'Sample Data (No API Key)',
      timestamp: new Date().toISOString(),
    })
  }

  try {
    const indicators: MacroIndicator[] = []
    const errors: string[] = []

    // Fetch all indicators in parallel
    const seriesEntries = Object.entries(MACRO_SERIES)
    const results = await Promise.all(
      seriesEntries.map(([seriesId]) => fetchSingleSeries(seriesId))
    )

    // Process results
    for (let i = 0; i < seriesEntries.length; i++) {
      const [seriesId, info] = seriesEntries[i]
      const result = results[i]

      if (result !== null) {
        // Special handling for certain series
        let displayValue = result.value
        if (seriesId === 'WALCL') {
          // Convert millions to billions
          displayValue = result.value / 1000
        }

        indicators.push({
          seriesId,
          name: info.name,
          value: displayValue,
          unit: info.unit,
          description: info.description,
          url: info.url,
          date: result.date,
        })
      } else {
        errors.push(seriesId)
      }
    }

    if (indicators.length === 0) {
      return NextResponse.json(
        { error: 'Failed to fetch any macro data', details: errors },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: indicators,
      source: 'FRED API (Live)',
      timestamp: new Date().toISOString(),
      missing: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Macro API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error fetching macro data' },
      { status: 500 }
    )
  }
}

// Sample macroeconomic data (November 2024 approximate values)
function getSampleMacroData(): MacroIndicator[] {
  return [
    {
      seriesId: 'UNRATE',
      name: 'Unemployment Rate',
      value: 4.1,
      unit: '%',
      description: 'Civilian unemployment rate',
      url: 'https://fred.stlouisfed.org/series/UNRATE',
      date: '2024-10-01',
    },
    {
      seriesId: 'PCEPILFE',
      name: 'Core PCE Inflation',
      value: 2.8,
      unit: '% YoY',
      description: "Fed's preferred inflation measure (excludes food & energy)",
      url: 'https://fred.stlouisfed.org/series/PCEPILFE',
      date: '2024-09-01',
    },
    {
      seriesId: 'CPIAUCSL',
      name: 'CPI (All Items)',
      value: 2.6,
      unit: '% YoY',
      description: 'Consumer Price Index for all urban consumers',
      url: 'https://fred.stlouisfed.org/series/CPIAUCSL',
      date: '2024-10-01',
    },
    {
      seriesId: 'A191RL1Q225SBEA',
      name: 'Real GDP Growth',
      value: 2.8,
      unit: '% QoQ',
      description: 'Percent change in real GDP (annualized)',
      url: 'https://fred.stlouisfed.org/series/A191RL1Q225SBEA',
      date: '2024-07-01',
    },
    {
      seriesId: 'VIXCLS',
      name: 'VIX Index',
      value: 14.5,
      unit: 'Index',
      description: 'Market volatility expectation (fear gauge)',
      url: 'https://fred.stlouisfed.org/series/VIXCLS',
      date: '2024-11-01',
    },
    {
      seriesId: 'WALCL',
      name: 'Fed Balance Sheet',
      value: 6957,
      unit: 'B USD',
      description: 'Total assets held by Federal Reserve',
      url: 'https://fred.stlouisfed.org/series/WALCL',
      date: '2024-11-06',
    },
    {
      seriesId: 'MORTGAGE30US',
      name: '30-Year Mortgage Rate',
      value: 6.79,
      unit: '%',
      description: 'Average mortgage rate (primary market)',
      url: 'https://fred.stlouisfed.org/series/MORTGAGE30US',
      date: '2024-11-07',
    },
  ]
}
