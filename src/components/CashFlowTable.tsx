import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { CashFlow } from '@/utils/duration';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CashFlowTableProps {
  cashFlows: CashFlow[];
  macaulayDuration: number;
}

export function CashFlowTable({ cashFlows, macaulayDuration }: CashFlowTableProps) {
  // Prepare chart data
  const chartData = cashFlows.map(cf => ({
    period: `T=${cf.time.toFixed(1)}`,
    presentValue: cf.presentValue,
    weight: (cf.weightedPV / cashFlows.reduce((sum, c) => sum + c.presentValue, 0)) * 100,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Flow Analysis</CardTitle>
        <CardDescription>
          Present values and contribution to Macaulay Duration ({macaulayDuration.toFixed(3)} years)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                <YAxis
                  yAxisId="left"
                  tickFormatter={v => `$${v.toFixed(0)}`}
                  label={{ value: 'PV ($)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={v => `${v.toFixed(0)}%`}
                  label={{ value: 'Weight (%)', angle: 90, position: 'insideRight' }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'presentValue') return [`$${value.toFixed(2)}`, 'Present Value'];
                    return [`${value.toFixed(2)}%`, 'Duration Weight'];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="presentValue"
                  fill="#2563eb"
                  name="Present Value"
                  opacity={0.8}
                />
                <Bar yAxisId="right" dataKey="weight" fill="#16a34a" name="Duration Weight" opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-background">
                <tr className="border-b">
                  <th className="text-left p-2">Period</th>
                  <th className="text-right p-2">Time (yrs)</th>
                  <th className="text-right p-2">Cash Flow</th>
                  <th className="text-right p-2">PV</th>
                  <th className="text-right p-2">Weighted PV</th>
                </tr>
              </thead>
              <tbody>
                {cashFlows.slice(0, 20).map(cf => (
                  <tr key={cf.period} className="border-b hover:bg-muted/50">
                    <td className="p-2">{cf.period}</td>
                    <td className="text-right p-2">{cf.time.toFixed(2)}</td>
                    <td className="text-right p-2">${cf.payment.toFixed(2)}</td>
                    <td className="text-right p-2">${cf.presentValue.toFixed(2)}</td>
                    <td className="text-right p-2">${cf.weightedPV.toFixed(2)}</td>
                  </tr>
                ))}
                {cashFlows.length > 20 && (
                  <tr>
                    <td colSpan={5} className="text-center p-2 text-muted-foreground">
                      ... and {cashFlows.length - 20} more periods
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="sticky bottom-0 bg-muted font-semibold">
                <tr>
                  <td colSpan={3} className="p-2">
                    Total
                  </td>
                  <td className="text-right p-2">
                    ${cashFlows.reduce((sum, cf) => sum + cf.presentValue, 0).toFixed(2)}
                  </td>
                  <td className="text-right p-2">
                    ${cashFlows.reduce((sum, cf) => sum + cf.weightedPV, 0).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm">
          <p className="font-semibold mb-2">Macaulay Duration Calculation:</p>
          <p className="text-muted-foreground">
            Duration = Σ(t × PV(CF<sub>t</sub>)) / Σ(PV(CF<sub>t</sub>)) ={' '}
            <span className="font-mono">
              {cashFlows.reduce((sum, cf) => sum + cf.weightedPV, 0).toFixed(2)} /{' '}
              {cashFlows.reduce((sum, cf) => sum + cf.presentValue, 0).toFixed(2)} ={' '}
              <strong>{macaulayDuration.toFixed(4)} years</strong>
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
