import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generatePriceYieldCurve, type BondParams } from '@/utils/duration';

interface PriceYieldChartProps {
  params: BondParams;
}

export function PriceYieldChart({ params }: PriceYieldChartProps) {
  const chartData = useMemo(() => generatePriceYieldCurve(params), [params]);

  const currentYield = params.ytm * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price-Yield Relationship</CardTitle>
        <CardDescription>
          Actual price vs. duration approximation (convex curve vs. linear tangent)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="yield"
                label={{ value: 'Yield to Maturity (%)', position: 'bottom', offset: 0 }}
                domain={['auto', 'auto']}
                tickFormatter={v => v.toFixed(1)}
              />
              <YAxis
                label={{
                  value: 'Bond Price ($)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                }}
                domain={['auto', 'auto']}
                tickFormatter={v => v.toFixed(0)}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `$${value.toFixed(2)}`,
                  name === 'price' ? 'Actual Price' : 'Duration Approx.',
                ]}
                labelFormatter={label => `YTM: ${Number(label).toFixed(2)}%`}
              />
              <Legend />
              <ReferenceLine
                x={currentYield}
                stroke="#666"
                strokeDasharray="5 5"
                label={{
                  value: 'Current YTM',
                  position: 'top',
                  fill: '#666',
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#2563eb"
                strokeWidth={3}
                name="Actual Price"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="durationApproxPrice"
                stroke="#dc2626"
                strokeWidth={2}
                strokeDasharray="8 4"
                name="Duration Linear Approx."
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm">
          <p className="font-semibold mb-2">Understanding the Chart:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>
              The <span className="text-blue-600 font-semibold">blue curve</span> shows the actual
              price-yield relationship (convex)
            </li>
            <li>
              The <span className="text-red-600 font-semibold">red dashed line</span> shows the
              duration-based linear approximation (tangent line)
            </li>
            <li>
              Duration underestimates price increases and overestimates price decreases (positive
              convexity)
            </li>
            <li>The gap between curves represents the "convexity effect"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
