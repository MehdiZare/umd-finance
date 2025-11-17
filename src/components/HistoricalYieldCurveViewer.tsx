import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { History, Play, Pause, SkipBack, SkipForward, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { fetchHistoricalRates, type HistoricalRatesResponse } from '@/utils/fred-api'

interface HistoricalPoint {
  date: string
  '2Y': number | null
  '10Y': number | null
  '30Y': number | null
  spread2s10s: number | null
}

// Simplified yield curve data for a given date
interface YieldCurveSnapshot {
  date: string
  curve: Array<{ maturity: string; years: number; rate: number }>
  spread2s10s: number
  isInverted: boolean
  isFlat: boolean
  isSteep: boolean
}

export function HistoricalYieldCurveViewer() {
  const [historicalData, setHistoricalData] = useState<HistoricalPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [dataSource, setDataSource] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const response = await fetchHistoricalRates(365)
        setHistoricalData(response.data)
        setDataSource(response.source)
        // Start at the end (most recent)
        setSelectedIndex(response.data.length - 1)
      } catch (error) {
        console.warn('Failed to fetch historical data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Auto-play animation
  useEffect(() => {
    if (!isPlaying || historicalData.length === 0) return

    const interval = setInterval(() => {
      setSelectedIndex((prev) => {
        if (prev >= historicalData.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isPlaying, historicalData.length])

  // Create a simplified yield curve for the selected date
  const selectedSnapshot = useMemo((): YieldCurveSnapshot | null => {
    if (historicalData.length === 0 || selectedIndex >= historicalData.length) return null

    const point = historicalData[selectedIndex]
    const spread = point.spread2s10s || 0

    // Create a simplified curve with just the available maturities
    const curve = []
    if (point['2Y'] !== null) {
      curve.push({ maturity: '2Y', years: 2, rate: point['2Y'] })
    }
    if (point['10Y'] !== null) {
      curve.push({ maturity: '10Y', years: 10, rate: point['10Y'] })
    }
    if (point['30Y'] !== null) {
      curve.push({ maturity: '30Y', years: 30, rate: point['30Y'] })
    }

    return {
      date: point.date,
      curve,
      spread2s10s: spread,
      isInverted: spread < 0,
      isFlat: Math.abs(spread) < 0.25,
      isSteep: spread > 1.0,
    }
  }, [historicalData, selectedIndex])

  const getShapeLabel = (snapshot: YieldCurveSnapshot) => {
    if (snapshot.isInverted) return { label: 'INVERTED', color: 'text-red-600', icon: <TrendingDown className="h-5 w-5" /> }
    if (snapshot.isFlat) return { label: 'FLAT', color: 'text-amber-600', icon: <Minus className="h-5 w-5" /> }
    if (snapshot.isSteep) return { label: 'STEEP', color: 'text-green-600', icon: <TrendingUp className="h-5 w-5" /> }
    return { label: 'NORMAL', color: 'text-blue-600', icon: <TrendingUp className="h-5 w-5" /> }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading historical yield curves...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (historicalData.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No historical data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Historical Yield Curve Shape
          {dataSource.includes('Live') && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Live Data</span>
          )}
        </CardTitle>
        <CardDescription>
          See how the yield curve shape evolved over time - watch for inversions (recession signals)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Date and Shape */}
          {selectedSnapshot && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">Selected Date</p>
                <p className="text-2xl font-bold">
                  {new Date(selectedSnapshot.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 ${getShapeLabel(selectedSnapshot).color}`}>
                  {getShapeLabel(selectedSnapshot).icon}
                  <span className="text-2xl font-bold">{getShapeLabel(selectedSnapshot).label}</span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">2Y-10Y Spread</p>
                  <p className={`text-lg font-bold ${selectedSnapshot.spread2s10s < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedSnapshot.spread2s10s > 0 ? '+' : ''}
                    {(selectedSnapshot.spread2s10s * 100).toFixed(0)} bps
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Yield Curve Chart */}
          {selectedSnapshot && selectedSnapshot.curve.length > 0 && (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={selectedSnapshot.curve}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="maturity" />
                  <YAxis
                    tickFormatter={(v) => `${v.toFixed(1)}%`}
                    domain={['auto', 'auto']}
                    label={{ value: 'Yield (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip formatter={(value) => [`${(value as number).toFixed(2)}%`, 'Yield']} />
                  <ReferenceLine y={4} stroke="#666" strokeDasharray="3 3" opacity={0.5} />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke={
                      selectedSnapshot.isInverted
                        ? '#dc2626'
                        : selectedSnapshot.isFlat
                          ? '#f59e0b'
                          : selectedSnapshot.isSteep
                            ? '#16a34a'
                            : '#2563eb'
                    }
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#fff', strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Timeline Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIndex(0)}
                disabled={selectedIndex === 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIndex((prev) => Math.max(0, prev - 1))}
                disabled={selectedIndex === 0}
              >
                Prev
              </Button>
              <Button
                variant={isPlaying ? 'destructive' : 'default'}
                size="sm"
                onClick={() => {
                  if (selectedIndex >= historicalData.length - 1) {
                    setSelectedIndex(0)
                  }
                  setIsPlaying(!isPlaying)
                }}
              >
                {isPlaying ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIndex((prev) => Math.min(historicalData.length - 1, prev + 1))}
                disabled={selectedIndex >= historicalData.length - 1}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIndex(historicalData.length - 1)}
                disabled={selectedIndex >= historicalData.length - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <Slider
                value={[selectedIndex]}
                onValueChange={([v]) => {
                  setIsPlaying(false)
                  setSelectedIndex(v)
                }}
                min={0}
                max={historicalData.length - 1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>
                  {historicalData.length > 0
                    ? new Date(historicalData[0].date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : ''}
                </span>
                <span>
                  {historicalData.length > 0
                    ? new Date(historicalData[historicalData.length - 1].date).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })
                    : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-4 bg-amber-50 rounded-lg text-sm">
            <p className="font-semibold text-amber-900">Understanding Yield Curve Shape:</p>
            <ul className="mt-2 space-y-1 text-amber-800">
              <li>
                <strong className="text-red-600">INVERTED</strong>: Short-term rates &gt; long-term rates - historically
                precedes recessions
              </li>
              <li>
                <strong className="text-amber-600">FLAT</strong>: Minimal difference - economic uncertainty
              </li>
              <li>
                <strong className="text-green-600">STEEP</strong>: Large positive spread - strong growth expectations
              </li>
              <li>
                <strong className="text-blue-600">NORMAL</strong>: Healthy upward slope - normal conditions
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
