import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  historicalYieldCurves,
  calculateMetricsForCurve,
  type HistoricalYieldCurve,
} from '@/utils/historical-data';

export function YieldCurveAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(2000); // ms between frames
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showMetrics, setShowMetrics] = useState(true);

  const currentCurve = historicalYieldCurves[currentIndex];
  const metrics = calculateMetricsForCurve(currentCurve.curves);

  // Previous curve for comparison
  const prevMetrics = currentIndex > 0
    ? calculateMetricsForCurve(historicalYieldCurves[currentIndex - 1].curves)
    : null;

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= historicalYieldCurves.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, animationSpeed);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, animationSpeed]);

  const handlePlayPause = () => {
    if (currentIndex >= historicalYieldCurves.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIndex(prev => Math.min(historicalYieldCurves.length - 1, prev + 1));
  };

  // Determine curve shape
  const getCurveShape = (curve: HistoricalYieldCurve['curves']) => {
    const rate2Y = curve.find(c => c.maturity === '2Y')?.rate || 0;
    const rate10Y = curve.find(c => c.maturity === '10Y')?.rate || 0;
    const spread = rate10Y - rate2Y;

    if (spread < -0.1) return { type: 'Inverted', color: 'text-red-600', icon: AlertTriangle };
    if (spread < 0.2) return { type: 'Flat', color: 'text-amber-600', icon: TrendingDown };
    if (spread < 1) return { type: 'Normal', color: 'text-green-600', icon: TrendingUp };
    return { type: 'Steep', color: 'text-blue-600', icon: TrendingUp };
  };

  const curveShape = getCurveShape(currentCurve.curves);
  const CurveIcon = curveShape.icon;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Historical Yield Curve Animation
          </CardTitle>
          <CardDescription>
            Watch how the U.S. Treasury yield curve evolved through major economic events and see the
            impact on fixed income risk metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Current Event Info */}
          <div className="mb-6 p-4 bg-primary/5 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">{currentCurve.description}</h3>
              <span className="text-sm font-mono bg-background px-2 py-1 rounded">
                {currentCurve.date}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{currentCurve.event}</p>
            <div className="mt-2 flex items-center gap-2">
              <CurveIcon className={`h-4 w-4 ${curveShape.color}`} />
              <span className={`font-semibold ${curveShape.color}`}>{curveShape.type} Yield Curve</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[350px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={currentCurve.curves}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="maturity"
                  label={{ value: 'Maturity', position: 'bottom', offset: 0 }}
                />
                <YAxis
                  domain={[0, 6]}
                  tickFormatter={v => `${v.toFixed(1)}%`}
                  label={{ value: 'Yield (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}%`, 'Yield']}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                />
                {/* Reference lines for key rates */}
                <ReferenceLine y={5} stroke="#dc2626" strokeDasharray="3 3" opacity={0.5} />
                <ReferenceLine y={2} stroke="#16a34a" strokeDasharray="3 3" opacity={0.5} />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#2563eb' }}
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="icon" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentIndex === 0}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button onClick={handlePlayPause} className="gap-2">
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    {currentIndex >= historicalYieldCurves.length - 1 ? 'Restart' : 'Play'}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currentIndex >= historicalYieldCurves.length - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Timeline slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{historicalYieldCurves[0].date}</span>
                <span>
                  Event {currentIndex + 1} of {historicalYieldCurves.length}
                </span>
                <span>{historicalYieldCurves[historicalYieldCurves.length - 1].date}</span>
              </div>
              <Slider
                value={[currentIndex]}
                onValueChange={([v]) => {
                  setIsPlaying(false);
                  setCurrentIndex(v);
                }}
                min={0}
                max={historicalYieldCurves.length - 1}
                step={1}
              />
            </div>

            {/* Speed control */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Speed:</span>
              <div className="flex gap-2">
                {[3000, 2000, 1000, 500].map(speed => (
                  <Button
                    key={speed}
                    variant={animationSpeed === speed ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAnimationSpeed(speed)}
                  >
                    {speed === 3000 ? 'Slow' : speed === 2000 ? 'Normal' : speed === 1000 ? 'Fast' : '2x'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Income Metrics Impact */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fixed Income Risk Metrics</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMetrics(!showMetrics)}
              className="gap-2"
            >
              <Info className="h-4 w-4" />
              {showMetrics ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
          <CardDescription>
            How the yield curve shape affects duration, convexity, and risk measures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="2Y-10Y Spread"
              value={`${metrics.spread2Y10Y.toFixed(2)}%`}
              prev={prevMetrics?.spread2Y10Y}
              description="Classic recession indicator"
              inverted={metrics.spread2Y10Y < 0}
            />
            <MetricCard
              title="10Y Duration"
              value={`${metrics.duration10Y.toFixed(2)} yrs`}
              prev={prevMetrics?.duration10Y}
              description="Modified duration"
            />
            <MetricCard
              title="30Y Duration"
              value={`${metrics.duration30Y.toFixed(2)} yrs`}
              prev={prevMetrics?.duration30Y}
              description="Modified duration"
            />
            <MetricCard
              title="10Y DV01"
              value={`$${metrics.dv01_10Y.toFixed(4)}`}
              prev={prevMetrics?.dv01_10Y}
              description="Per $100 face value"
            />
          </div>

          {showMetrics && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Duration Risk Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>2Y Bond:</strong> {metrics.duration2Y.toFixed(3)} years duration
                      <br />
                      <span className="text-muted-foreground">
                        1% yield increase = ~{metrics.duration2Y.toFixed(2)}% price drop
                      </span>
                    </p>
                    <p>
                      <strong>10Y Bond:</strong> {metrics.duration10Y.toFixed(3)} years duration
                      <br />
                      <span className="text-muted-foreground">
                        1% yield increase = ~{metrics.duration10Y.toFixed(2)}% price drop
                      </span>
                    </p>
                    <p>
                      <strong>30Y Bond:</strong> {metrics.duration30Y.toFixed(3)} years duration
                      <br />
                      <span className="text-muted-foreground">
                        1% yield increase = ~{metrics.duration30Y.toFixed(2)}% price drop
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Convexity & Risk</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>10Y Convexity:</strong> {metrics.convexity10Y.toFixed(2)}
                    </p>
                    <p>
                      <strong>30Y Convexity:</strong> {metrics.convexity30Y.toFixed(2)}
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Higher convexity provides better protection against large rate moves. The 30Y
                      bond has significantly more convexity, benefiting investors in volatile markets.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold mb-2">Educational Insight: {currentCurve.description}</h4>
                <p className="text-sm">
                  {getEducationalInsight(currentCurve, metrics)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  prev?: number;
  description: string;
  inverted?: boolean;
}

function MetricCard({ title, value, prev, description, inverted }: MetricCardProps) {
  const currentValue = parseFloat(value);
  const change = prev !== undefined ? currentValue - prev : 0;
  const changePercent = prev !== undefined && prev !== 0 ? ((currentValue - prev) / prev) * 100 : 0;

  return (
    <div className={`p-3 rounded-lg border ${inverted ? 'border-red-500 bg-red-50 dark:bg-red-950' : 'bg-card'}`}>
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className={`text-lg font-bold ${inverted ? 'text-red-600' : ''}`}>{value}</p>
      {prev !== undefined && Math.abs(change) > 0.001 && (
        <p className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}
          {changePercent.toFixed(1)}% vs prev
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

function getEducationalInsight(curve: HistoricalYieldCurve, metrics: ReturnType<typeof calculateMetricsForCurve>): string {
  const date = curve.date;

  if (date.includes('2007')) {
    return 'Before the financial crisis, the yield curve was relatively flat, signaling that the market expected slower growth. Duration risk was moderate across maturities.';
  }
  if (date.includes('2008-09')) {
    return 'During the Lehman collapse, short-term rates plummeted as the Fed cut rates aggressively. The steep curve shows massive uncertainty about the future. Duration of longer bonds increased significantly as yields fell.';
  }
  if (date.includes('2009')) {
    return 'With rates near zero, duration of short-term bonds collapsed while long-term bond duration reached extreme levels. A 30Y bond with ~17 years duration would lose ~17% for a 1% yield increase.';
  }
  if (date.includes('2019-08')) {
    return `The inverted yield curve (${metrics.spread2Y10Y.toFixed(2)}% spread) historically predicts recessions within 12-18 months. Investors accepted lower long-term yields, betting on future rate cuts.`;
  }
  if (date.includes('2020-03')) {
    return 'COVID-19 panic drove yields to historic lows. Short-term bonds had minimal duration risk, but long-term bonds became extremely sensitive to any yield changes.';
  }
  if (date.includes('2022')) {
    return 'Aggressive Fed tightening pushed short rates higher faster than long rates, creating an inverted curve. High absolute yields meant lower durations than the 2020 lows.';
  }
  if (date.includes('2023-10')) {
    return 'The "higher for longer" narrative pushed the 10Y yield to 5%, increasing price risk. A portfolio of 10Y bonds would be extremely sensitive to any further rate increases.';
  }

  return `With a ${metrics.spread2Y10Y.toFixed(2)}% 2Y-10Y spread, the curve is ${
    metrics.spread2Y10Y < 0 ? 'inverted (bearish signal)' : 'upward sloping (normal)'
  }. Duration of the 10Y bond is ${metrics.duration10Y.toFixed(2)} years, meaning significant price sensitivity to yield changes.`;
}
