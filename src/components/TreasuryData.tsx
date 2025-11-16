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
  Bar,
  BarChart,
} from 'recharts';
import { RefreshCw, TrendingUp, ExternalLink, Database, Info, AlertTriangle } from 'lucide-react';
import {
  fetchTreasuryData,
  getMockYieldCurve,
  getMockHistoricalRates,
  type YieldCurvePoint,
  type AdditionalIndicator,
  type TreasuryAPIResponse,
  treasuryBondParams,
} from '@/utils/fred-api';
import { calculateDuration } from '@/utils/duration';
import { DataStatusBadge, SuccessMessage, ErrorMessage, type DataSourceStatus } from './DataStatus';
import { YieldCurveAnimation } from './YieldCurveAnimation';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// FRED series URLs for direct source links
const SERIES_INFO: Record<string, { name: string; url: string; description: string }> = {
  DGS1MO: { name: '1-Month Treasury', url: 'https://fred.stlouisfed.org/series/DGS1MO', description: 'Treasury Constant Maturity Rate' },
  DGS3MO: { name: '3-Month Treasury', url: 'https://fred.stlouisfed.org/series/DGS3MO', description: 'Treasury Constant Maturity Rate' },
  DGS6MO: { name: '6-Month Treasury', url: 'https://fred.stlouisfed.org/series/DGS6MO', description: 'Treasury Constant Maturity Rate' },
  DGS1: { name: '1-Year Treasury', url: 'https://fred.stlouisfed.org/series/DGS1', description: 'Treasury Constant Maturity Rate' },
  DGS2: { name: '2-Year Treasury', url: 'https://fred.stlouisfed.org/series/DGS2', description: 'Treasury Constant Maturity Rate' },
  DGS3: { name: '3-Year Treasury', url: 'https://fred.stlouisfed.org/series/DGS3', description: 'Treasury Constant Maturity Rate' },
  DGS5: { name: '5-Year Treasury', url: 'https://fred.stlouisfed.org/series/DGS5', description: 'Treasury Constant Maturity Rate' },
  DGS7: { name: '7-Year Treasury', url: 'https://fred.stlouisfed.org/series/DGS7', description: 'Treasury Constant Maturity Rate' },
  DGS10: { name: '10-Year Treasury', url: 'https://fred.stlouisfed.org/series/DGS10', description: 'Treasury Constant Maturity Rate' },
  DGS20: { name: '20-Year Treasury', url: 'https://fred.stlouisfed.org/series/DGS20', description: 'Treasury Constant Maturity Rate' },
  DGS30: { name: '30-Year Treasury', url: 'https://fred.stlouisfed.org/series/DGS30', description: 'Treasury Constant Maturity Rate' },
};

export function TreasuryData() {
  const [yieldCurve, setYieldCurve] = useState<YieldCurvePoint[]>(getMockYieldCurve());
  const [additionalIndicators, setAdditionalIndicators] = useState<AdditionalIndicator[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataStatus, setDataStatus] = useState<DataSourceStatus>('idle');
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [dataSource, setDataSource] = useState<string>('Sample Data');

  const historicalData = getMockHistoricalRates();

  const fetchData = async () => {
    setLoading(true);
    setDataStatus('loading');
    setStatusMessage('Connecting to FRED API...');

    try {
      const response: TreasuryAPIResponse = await fetchTreasuryData();
      if (response.data.length > 0) {
        setYieldCurve(response.data);
        setAdditionalIndicators(response.additionalIndicators || []);
        setLastUpdated(new Date(response.timestamp));
        setDataSource(response.source);

        // Check if we're using sample data (no API key configured)
        if (response.source.includes('Sample')) {
          setDataStatus('idle'); // Not an error, but not live data either
          const message = (response as TreasuryAPIResponse & { message?: string }).message;
          setStatusMessage(
            message ||
              'Using sample data. Set FRED_API_KEY environment variable for live data.'
          );
        } else {
          setDataStatus('success');
          setStatusMessage(
            `Successfully retrieved ${response.data.length} treasury rates and ${response.additionalIndicators?.length || 0} additional indicators from FRED`
          );
        }
      } else {
        throw new Error('No data received from API');
      }
    } catch (err) {
      console.warn('FRED API unavailable:', err);
      setDataStatus('error');
      setStatusMessage('FRED API unavailable. Using sample data for demonstration.');
      setYieldCurve(getMockYieldCurve());
      setAdditionalIndicators([]);
      setDataSource('Sample Data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate durations for each treasury maturity
  const durationData = yieldCurve.map(point => {
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

  // Categorize indicators for display
  const fedFunds = additionalIndicators.find(i => i.seriesId === 'DFF');
  const tipsRates = additionalIndicators.filter(i => i.seriesId.startsWith('DFII'));
  const breakevens = additionalIndicators.filter(i => i.seriesId.includes('YIE'));
  const creditSpreads = additionalIndicators.filter(i => i.seriesId.includes('BAML'));

  // Compare nominal vs real yields
  const realVsNominal = [
    {
      maturity: '5Y',
      nominal: yieldCurve.find(y => y.maturity === '5Y')?.rate || 0,
      real: tipsRates.find(t => t.seriesId === 'DFII5')?.value || 0,
      breakeven: breakevens.find(b => b.seriesId === 'T5YIE')?.value || 0,
    },
    {
      maturity: '10Y',
      nominal: yieldCurve.find(y => y.maturity === '10Y')?.rate || 0,
      real: tipsRates.find(t => t.seriesId === 'DFII10')?.value || 0,
      breakeven: breakevens.find(b => b.seriesId === 'T10YIE')?.value || 0,
    },
    {
      maturity: '30Y',
      nominal: yieldCurve.find(y => y.maturity === '30Y')?.rate || 0,
      real: tipsRates.find(t => t.seriesId === 'DFII30')?.value || 0,
      breakeven: breakevens.find(b => b.seriesId === 'T30YIEM')?.value || 0,
    },
  ].filter(d => d.real > 0);

  return (
    <div className="space-y-6">
      {/* Data Status Information */}
      {statusMessage && (
        <div>
          {dataStatus === 'success' ? (
            <SuccessMessage message={statusMessage} timestamp={lastUpdated} />
          ) : dataStatus === 'error' ? (
            <ErrorMessage
              title="Live Data Unavailable"
              message={statusMessage}
              onRetry={fetchData}
            />
          ) : dataStatus === 'idle' && dataSource.includes('Sample') ? (
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900">Using Sample Data</h3>
                    <p className="text-sm text-amber-800 mt-1">{statusMessage}</p>
                    <p className="text-xs text-amber-700 mt-2">
                      Get your free FRED API key at{' '}
                      <a
                        href="https://fred.stlouisfed.org/docs/api/api_key.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-amber-900"
                      >
                        fred.stlouisfed.org
                      </a>
                      , then add FRED_API_KEY to your environment variables.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}

      {/* Data Source Attribution */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Data Source Attribution</h3>
              <p className="text-sm text-blue-800 mt-1">
                All treasury data is sourced from{' '}
                <a
                  href="https://fred.stlouisfed.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-blue-600"
                >
                  FRED (Federal Reserve Economic Data)
                </a>
                {' '}maintained by the Federal Reserve Bank of St. Louis.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href="https://fred.stlouisfed.org/categories/115"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                >
                  <ExternalLink className="h-3 w-3" />
                  Treasury Securities
                </a>
                <a
                  href="https://fred.stlouisfed.org/categories/82"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                >
                  <ExternalLink className="h-3 w-3" />
                  Interest Rates
                </a>
                <a
                  href="https://fred.stlouisfed.org/release?rid=18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                >
                  <ExternalLink className="h-3 w-3" />
                  H.15 Release
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Economic Indicators */}
      {additionalIndicators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Key Economic Indicators
            </CardTitle>
            <CardDescription>
              Live data from FRED - Click any indicator to view the source data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Federal Funds Rate */}
              {fedFunds && (
                <a
                  href={fedFunds.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Fed Funds Rate</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold mt-1">{fedFunds.value.toFixed(2)}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Current policy rate</div>
                </a>
              )}

              {/* Investment Grade Spread */}
              {creditSpreads.find(s => s.seriesId === 'BAMLC0A0CM') && (
                <a
                  href={creditSpreads.find(s => s.seriesId === 'BAMLC0A0CM')!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">IG Corporate Spread</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {creditSpreads.find(s => s.seriesId === 'BAMLC0A0CM')!.value.toFixed(0)} bps
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Credit risk premium</div>
                </a>
              )}

              {/* High Yield Spread */}
              {creditSpreads.find(s => s.seriesId === 'BAMLH0A0HYM2') && (
                <a
                  href={creditSpreads.find(s => s.seriesId === 'BAMLH0A0HYM2')!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">High Yield Spread</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {creditSpreads.find(s => s.seriesId === 'BAMLH0A0HYM2')!.value.toFixed(0)} bps
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Junk bond risk premium</div>
                </a>
              )}

              {/* 10Y Breakeven Inflation */}
              {breakevens.find(b => b.seriesId === 'T10YIE') && (
                <a
                  href={breakevens.find(b => b.seriesId === 'T10YIE')!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">10Y Breakeven Inflation</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {breakevens.find(b => b.seriesId === 'T10YIE')!.value.toFixed(2)}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Market inflation expectation</div>
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real vs Nominal Yields */}
      {realVsNominal.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Nominal vs Real Yields (TIPS)</CardTitle>
            <CardDescription>
              Compare treasury yields with inflation-protected securities to see implied inflation expectations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={realVsNominal} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="maturity" />
                  <YAxis tickFormatter={v => `${v.toFixed(1)}%`} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`]} />
                  <Bar dataKey="nominal" name="Nominal Yield" fill="#2563eb" />
                  <Bar dataKey="real" name="Real Yield (TIPS)" fill="#16a34a" />
                  <Bar dataKey="breakeven" name="Breakeven Inflation" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-amber-50 rounded-lg text-sm">
              <p className="font-semibold text-amber-900">Understanding Breakeven Inflation:</p>
              <p className="text-amber-800 mt-1">
                Breakeven inflation = Nominal Yield - TIPS Yield. This represents the market&apos;s expectation
                for average inflation over the bond&apos;s life. If actual inflation exceeds this rate, TIPS outperform nominal bonds.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historical Animation */}
      <YieldCurveAnimation />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Current U.S. Treasury Yield Curve
              </CardTitle>
              <CardDescription>
                {dataSource === 'FRED API (Live)'
                  ? 'Live treasury rates from FRED (St. Louis Federal Reserve)'
                  : 'Sample treasury data for demonstration'}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <DataStatusBadge
                status={dataStatus}
                source={dataSource}
                lastUpdated={lastUpdated}
                onRetry={fetchData}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Fetching...' : 'Refresh Data'}
              </Button>
            </div>
          </div>
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

      {/* Duration by Maturity with Source Links */}
      <Card>
        <CardHeader>
          <CardTitle>Treasury Duration by Maturity</CardTitle>
          <CardDescription>
            Modified duration for on-the-run treasuries - Click maturity to view FRED source data
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
                  <th className="text-center p-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {durationData.map(d => {
                  const seriesId = Object.entries({
                    '1M': 'DGS1MO', '3M': 'DGS3MO', '6M': 'DGS6MO', '1Y': 'DGS1',
                    '2Y': 'DGS2', '3Y': 'DGS3', '5Y': 'DGS5', '7Y': 'DGS7',
                    '10Y': 'DGS10', '20Y': 'DGS20', '30Y': 'DGS30',
                  }).find(([mat]) => mat === d.maturity)?.[1];
                  const sourceInfo = seriesId ? SERIES_INFO[seriesId] : null;

                  return (
                    <tr key={d.maturity} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{d.maturity}</td>
                      <td className="text-right p-2">{d.yield.toFixed(2)}%</td>
                      <td className="text-right p-2">{d.macaulayDuration.toFixed(3)}</td>
                      <td className="text-right p-2">{d.modifiedDuration.toFixed(3)}</td>
                      <td className="text-right p-2">
                        ${(d.dollarDuration / 10).toFixed(4)}
                      </td>
                      <td className="text-center p-2">
                        {sourceInfo && (
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={sourceInfo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLink className="h-3 w-3" />
                                FRED
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{sourceInfo.description}</p>
                              <p className="text-xs text-muted-foreground">Click to view on FRED</p>
                            </TooltipContent>
                          </UITooltip>
                        )}
                      </td>
                    </tr>
                  );
                })}
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
