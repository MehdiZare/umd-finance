import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import {
  fetchYieldCurve,
  getMockYieldCurve,
  getMockHistoricalRates,
  type YieldCurvePoint,
  treasuryBondParams,
} from '@/utils/fred-api';
import { calculateDuration } from '@/utils/duration';

export function TreasuryData() {
  const [yieldCurve, setYieldCurve] = useState<YieldCurvePoint[]>(getMockYieldCurve());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const historicalData = getMockHistoricalRates();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchYieldCurve();
      if (data.length > 0) {
        setYieldCurve(data);
        setLastUpdated(new Date());
      } else {
        throw new Error('No data received');
      }
    } catch {
      setError('Failed to fetch live data. Using sample data.');
      setYieldCurve(getMockYieldCurve());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to fetch real data on mount
    fetchData();
  }, []);

  // Calculate durations for each treasury maturity
  const durationData = yieldCurve.map(point => {
    // Assume coupon rate equals current yield for simplicity
    const params = treasuryBondParams(point.years, point.rate, point.rate);
    const results = calculateDuration(params);

    return {
      maturity: point.maturity,
      years: point.years,
      yield: point.rate,
      macaulayDuration: results.macaulayDuration,
      modifiedDuration: results.modifiedDuration,
      dollarDuration: results.dollarDuration,
    };
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                U.S. Treasury Yield Curve
              </CardTitle>
              <CardDescription>
                Current treasury rates from FRED (St. Louis Federal Reserve)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {error && (
                <span className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Sample Data
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={yieldCurve}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="maturity" />
                <YAxis
                  tickFormatter={v => `${v.toFixed(1)}%`}
                  domain={['auto', 'auto']}
                  label={{ value: 'Yield (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'Yield']} />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Yield Curve Shape Analysis */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="font-semibold mb-2">Yield Curve Analysis:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">2Y-10Y Spread</p>
                <p className="text-lg font-bold">
                  {(
                    (yieldCurve.find(y => y.maturity === '10Y')?.rate || 0) -
                    (yieldCurve.find(y => y.maturity === '2Y')?.rate || 0)
                  ).toFixed(2)}
                  %
                </p>
                <p className="text-xs text-muted-foreground">
                  {(yieldCurve.find(y => y.maturity === '10Y')?.rate || 0) >
                  (yieldCurve.find(y => y.maturity === '2Y')?.rate || 0)
                    ? 'Normal (upward sloping)'
                    : 'Inverted (recession signal)'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Short-term (3M)</p>
                <p className="text-lg font-bold">
                  {yieldCurve.find(y => y.maturity === '3M')?.rate.toFixed(2) || 'N/A'}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Long-term (30Y)</p>
                <p className="text-lg font-bold">
                  {yieldCurve.find(y => y.maturity === '30Y')?.rate.toFixed(2) || 'N/A'}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duration by Maturity */}
      <Card>
        <CardHeader>
          <CardTitle>Treasury Duration by Maturity</CardTitle>
          <CardDescription>
            Modified duration for on-the-run treasuries (assuming coupon = yield)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={durationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="maturity" />
                <YAxis
                  label={{ value: 'Duration (years)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    value.toFixed(3),
                    name === 'macaulayDuration' ? 'Macaulay' : 'Modified',
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="macaulayDuration"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Macaulay Duration"
                />
                <Line
                  type="monotone"
                  dataKey="modifiedDuration"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name="Modified Duration"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Maturity</th>
                  <th className="text-right p-2">Yield</th>
                  <th className="text-right p-2">Macaulay</th>
                  <th className="text-right p-2">Modified</th>
                  <th className="text-right p-2">DV01 (per $100)</th>
                </tr>
              </thead>
              <tbody>
                {durationData.map(d => (
                  <tr key={d.maturity} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{d.maturity}</td>
                    <td className="text-right p-2">{d.yield.toFixed(2)}%</td>
                    <td className="text-right p-2">{d.macaulayDuration.toFixed(3)}</td>
                    <td className="text-right p-2">{d.modifiedDuration.toFixed(3)}</td>
                    <td className="text-right p-2">
                      ${(d.dollarDuration / 10).toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Historical Spread */}
      <Card>
        <CardHeader>
          <CardTitle>Historical Treasury Rates</CardTitle>
          <CardDescription>2Y vs 10Y spread over time (sample data)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis
                  tickFormatter={v => `${v.toFixed(1)}%`}
                  label={{ value: 'Yield (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`]} />
                <Line type="monotone" dataKey="2Y" stroke="#2563eb" name="2-Year" />
                <Line type="monotone" dataKey="10Y" stroke="#16a34a" name="10-Year" />
                <Line type="monotone" dataKey="30Y" stroke="#dc2626" name="30-Year" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
