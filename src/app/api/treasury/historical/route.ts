// API Route for fetching historical FRED Treasury data
// Fetches time series data for yield curve analysis

import { NextResponse } from 'next/server'

const FRED_BASE_URL = 'https://api.stlouisfed.org/fred'
const FRED_API_KEY = process.env.FRED_API_KEY || ''

// Series to fetch for historical analysis
const HISTORICAL_SERIES = {
  DGS2: '2Y',
  DGS10: '10Y',
  DGS30: '30Y',
}

interface HistoricalPoint {
  date: string
  '2Y': number | null
  '10Y': number | null
  '30Y': number | null
  spread2s10s: number | null
}

async function fetchHistoricalSeries(
  seriesId: string,
  limit: number = 365
): Promise<Array<{ date: string; value: number }>> {
  if (!FRED_API_KEY) {
    return []
  }

  try {
    const url = `${FRED_BASE_URL}/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=${limit}`

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`FRED API error for ${seriesId}: ${response.status}`)
      return []
    }

    const data = await response.json()

    if (!data.observations || data.observations.length === 0) {
      return []
    }

    // Filter out missing values and parse
    return data.observations
      .filter((obs: { value: string }) => obs.value !== '.')
      .map((obs: { date: string; value: string }) => ({
        date: obs.date,
        value: parseFloat(obs.value),
      }))
      .filter((obs: { date: string; value: number }) => !isNaN(obs.value))
  } catch (error) {
    console.error(`Error fetching ${seriesId}:`, error)
    return []
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const days = parseInt(searchParams.get('days') || '365')

  // If no API key is configured, return sample data
  if (!FRED_API_KEY) {
    console.info('No FRED_API_KEY configured. Using sample historical data.')
    return NextResponse.json({
      data: getSampleHistoricalData(),
      source: 'Sample Data (No API Key)',
      timestamp: new Date().toISOString(),
      message:
        'Set FRED_API_KEY environment variable for live historical data. Get free key at https://fred.stlouisfed.org/docs/api/api_key.html',
    })
  }

  try {
    // Fetch all series in parallel
    const [dgs2Data, dgs10Data, dgs30Data] = await Promise.all([
      fetchHistoricalSeries('DGS2', days),
      fetchHistoricalSeries('DGS10', days),
      fetchHistoricalSeries('DGS30', days),
    ])

    if (dgs2Data.length === 0 && dgs10Data.length === 0 && dgs30Data.length === 0) {
      return NextResponse.json({
        data: getSampleHistoricalData(),
        source: 'Sample Data (API Error)',
        timestamp: new Date().toISOString(),
        message: 'Failed to fetch historical data from FRED. Using sample data.',
      })
    }

    // Create a map of all dates
    const dateMap = new Map<string, HistoricalPoint>()

    // Initialize with all dates from all series
    const allDates = new Set([
      ...dgs2Data.map((d) => d.date),
      ...dgs10Data.map((d) => d.date),
      ...dgs30Data.map((d) => d.date),
    ])

    allDates.forEach((date) => {
      dateMap.set(date, {
        date,
        '2Y': null,
        '10Y': null,
        '30Y': null,
        spread2s10s: null,
      })
    })

    // Fill in values
    dgs2Data.forEach((obs) => {
      const point = dateMap.get(obs.date)
      if (point) point['2Y'] = obs.value
    })

    dgs10Data.forEach((obs) => {
      const point = dateMap.get(obs.date)
      if (point) point['10Y'] = obs.value
    })

    dgs30Data.forEach((obs) => {
      const point = dateMap.get(obs.date)
      if (point) point['30Y'] = obs.value
    })

    // Calculate spreads and filter for complete data
    const historicalData: HistoricalPoint[] = []
    dateMap.forEach((point) => {
      if (point['2Y'] !== null && point['10Y'] !== null) {
        point.spread2s10s = point['10Y'] - point['2Y']
        historicalData.push(point)
      }
    })

    // Sort by date ascending
    historicalData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Resample to reduce data points if too many (take every nth point)
    const maxPoints = 100
    let finalData = historicalData
    if (historicalData.length > maxPoints) {
      const step = Math.ceil(historicalData.length / maxPoints)
      finalData = historicalData.filter((_, index) => index % step === 0)
      // Always include the last point
      if (finalData[finalData.length - 1] !== historicalData[historicalData.length - 1]) {
        finalData.push(historicalData[historicalData.length - 1])
      }
    }

    return NextResponse.json({
      data: finalData,
      source: 'FRED API (Live)',
      timestamp: new Date().toISOString(),
      totalPoints: historicalData.length,
      displayedPoints: finalData.length,
    })
  } catch (error) {
    console.error('Historical Treasury API route error:', error)
    return NextResponse.json({
      data: getSampleHistoricalData(),
      source: 'Sample Data (Error)',
      timestamp: new Date().toISOString(),
      message: 'Error fetching historical data. Using sample data.',
    })
  }
}

// Sample historical data (2024 yield curve evolution)
function getSampleHistoricalData(): HistoricalPoint[] {
  return [
    { date: '2024-01-02', '2Y': 4.21, '10Y': 3.95, '30Y': 4.12, spread2s10s: -0.26 },
    { date: '2024-02-01', '2Y': 4.43, '10Y': 4.1, '30Y': 4.25, spread2s10s: -0.33 },
    { date: '2024-03-01', '2Y': 4.59, '10Y': 4.2, '30Y': 4.34, spread2s10s: -0.39 },
    { date: '2024-04-01', '2Y': 4.72, '10Y': 4.35, '30Y': 4.48, spread2s10s: -0.37 },
    { date: '2024-05-01', '2Y': 4.87, '10Y': 4.42, '30Y': 4.54, spread2s10s: -0.45 },
    { date: '2024-06-03', '2Y': 4.71, '10Y': 4.28, '30Y': 4.43, spread2s10s: -0.43 },
    { date: '2024-07-01', '2Y': 4.51, '10Y': 4.18, '30Y': 4.38, spread2s10s: -0.33 },
    { date: '2024-08-01', '2Y': 4.38, '10Y': 4.02, '30Y': 4.26, spread2s10s: -0.36 },
    { date: '2024-09-03', '2Y': 3.62, '10Y': 3.71, '30Y': 4.03, spread2s10s: 0.09 },
    { date: '2024-10-01', '2Y': 4.08, '10Y': 4.21, '30Y': 4.45, spread2s10s: 0.13 },
    { date: '2024-11-01', '2Y': 4.15, '10Y': 4.28, '30Y': 4.48, spread2s10s: 0.13 },
  ]
}
