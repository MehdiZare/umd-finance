// API Route for fetching FRED Treasury data server-side
// This solves CORS issues by making the request from the server

import { NextResponse } from 'next/server'

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred'

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

interface YieldCurvePoint {
  maturity: string
  years: number
  rate: number
}

async function fetchSingleSeries(seriesId: string): Promise<number | null> {
  try {
    const url = `${FRED_BASE_URL}/series/observations?series_id=${seriesId}&file_type=json&sort_order=desc&limit=1`

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
  try {
    const yieldCurve: YieldCurvePoint[] = []
    const errors: string[] = []

    // Fetch all series in parallel
    const seriesEntries = Object.entries(TREASURY_SERIES)
    const results = await Promise.all(
      seriesEntries.map(([seriesId]) => fetchSingleSeries(seriesId))
    )

    // Process results
    for (let i = 0; i < seriesEntries.length; i++) {
      const [, maturityLabel] = seriesEntries[i]
      const rate = results[i]

      if (rate !== null) {
        yieldCurve.push({
          maturity: maturityLabel,
          years: MATURITY_YEARS[maturityLabel],
          rate: rate,
        })
      } else {
        errors.push(maturityLabel)
      }
    }

    // Sort by years to maturity
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

    return NextResponse.json({
      data: yieldCurve,
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
