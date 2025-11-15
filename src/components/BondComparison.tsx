import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateDuration, type BondParams } from '@/utils/duration';
import { Plus, Trash2, Scale } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface Bond {
  id: string;
  name: string;
  params: BondParams;
}

const defaultBonds: Bond[] = [
  {
    id: '1',
    name: 'Short-Term (5Y)',
    params: {
      faceValue: 1000,
      couponRate: 0.04,
      yearsToMaturity: 5,
      ytm: 0.045,
      frequency: 2,
    },
  },
  {
    id: '2',
    name: 'Medium-Term (10Y)',
    params: {
      faceValue: 1000,
      couponRate: 0.05,
      yearsToMaturity: 10,
      ytm: 0.045,
      frequency: 2,
    },
  },
  {
    id: '3',
    name: 'Long-Term (30Y)',
    params: {
      faceValue: 1000,
      couponRate: 0.06,
      yearsToMaturity: 30,
      ytm: 0.045,
      frequency: 2,
    },
  },
];

export function BondComparison() {
  const [bonds, setBonds] = useState<Bond[]>(defaultBonds);

  const addBond = () => {
    const newId = String(Date.now());
    setBonds([
      ...bonds,
      {
        id: newId,
        name: `Bond ${bonds.length + 1}`,
        params: {
          faceValue: 1000,
          couponRate: 0.05,
          yearsToMaturity: 10,
          ytm: 0.05,
          frequency: 2,
        },
      },
    ]);
  };

  const removeBond = (id: string) => {
    if (bonds.length > 1) {
      setBonds(bonds.filter(b => b.id !== id));
    }
  };

  const updateBond = (id: string, field: string, value: number | string) => {
    setBonds(
      bonds.map(bond => {
        if (bond.id === id) {
          if (field === 'name') {
            return { ...bond, name: String(value) };
          }
          return {
            ...bond,
            params: { ...bond.params, [field]: value },
          };
        }
        return bond;
      })
    );
  };

  // Calculate results for all bonds
  const results = bonds.map(bond => ({
    ...bond,
    results: calculateDuration(bond.params),
  }));

  // Prepare comparison chart data
  const comparisonData = results.map(r => ({
    name: r.name,
    'Macaulay Duration': r.results.macaulayDuration,
    'Modified Duration': r.results.modifiedDuration,
    Convexity: r.results.convexity / 10, // Scale down for display
  }));

  // Prepare radar chart data
  const radarData = [
    {
      metric: 'Duration',
      ...Object.fromEntries(
        results.map(r => [
          r.name,
          (r.results.modifiedDuration / Math.max(...results.map(x => x.results.modifiedDuration))) *
            100,
        ])
      ),
    },
    {
      metric: 'Convexity',
      ...Object.fromEntries(
        results.map(r => [
          r.name,
          (r.results.convexity / Math.max(...results.map(x => x.results.convexity))) * 100,
        ])
      ),
    },
    {
      metric: 'Price',
      ...Object.fromEntries(
        results.map(r => [
          r.name,
          (r.results.price / Math.max(...results.map(x => x.results.price))) * 100,
        ])
      ),
    },
    {
      metric: 'Coupon Rate',
      ...Object.fromEntries(
        results.map(r => [
          r.name,
          (r.params.couponRate / Math.max(...results.map(x => x.params.couponRate))) * 100,
        ])
      ),
    },
    {
      metric: 'YTM',
      ...Object.fromEntries(
        results.map(r => [
          r.name,
          (r.params.ytm / Math.max(...results.map(x => x.params.ytm))) * 100,
        ])
      ),
    },
  ];

  const colors = ['#2563eb', '#dc2626', '#16a34a', '#eab308', '#8b5cf6'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          Bond Comparison Tool
        </CardTitle>
        <CardDescription>
          Compare duration and risk characteristics across different bonds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Bond Input Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bonds.map((bond, index) => (
              <Card key={bond.id} className="relative">
                <CardContent className="pt-4">
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBond(bond.id)}
                      disabled={bonds.length === 1}
                      className="h-6 w-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Bond Name</Label>
                      <Input
                        value={bond.name}
                        onChange={e => updateBond(bond.id, 'name', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Maturity (yrs)</Label>
                        <Input
                          type="number"
                          value={bond.params.yearsToMaturity}
                          onChange={e =>
                            updateBond(bond.id, 'yearsToMaturity', Number(e.target.value))
                          }
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Coupon (%)</Label>
                        <Input
                          type="number"
                          value={bond.params.couponRate * 100}
                          onChange={e =>
                            updateBond(bond.id, 'couponRate', Number(e.target.value) / 100)
                          }
                          className="h-8"
                          step={0.25}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">YTM (%)</Label>
                        <Input
                          type="number"
                          value={bond.params.ytm * 100}
                          onChange={e => updateBond(bond.id, 'ytm', Number(e.target.value) / 100)}
                          className="h-8"
                          step={0.25}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Freq</Label>
                        <select
                          value={bond.params.frequency}
                          onChange={e => updateBond(bond.id, 'frequency', Number(e.target.value))}
                          className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm"
                        >
                          <option value={1}>Annual</option>
                          <option value={2}>Semi</option>
                          <option value={4}>Qtr</option>
                        </select>
                      </div>
                    </div>
                    <div
                      className="p-2 rounded text-xs space-y-1"
                      style={{ backgroundColor: colors[index % colors.length] + '20' }}
                    >
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-mono font-semibold">
                          ${results[index].results.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mod Duration:</span>
                        <span className="font-mono font-semibold">
                          {results[index].results.modifiedDuration.toFixed(3)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Convexity:</span>
                        <span className="font-mono font-semibold">
                          {results[index].results.convexity.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {bonds.length < 5 && (
              <Card className="flex items-center justify-center min-h-[200px] border-dashed">
                <Button variant="ghost" onClick={addBond} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Bond
                </Button>
              </Card>
            )}
          </div>

          {/* Comparison Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="h-[300px]">
              <h4 className="font-semibold mb-2">Duration & Convexity Comparison</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Macaulay Duration" fill="#2563eb" />
                  <Bar dataKey="Modified Duration" fill="#dc2626" />
                  <Bar dataKey="Convexity" fill="#16a34a" name="Convexity (÷10)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Chart */}
            <div className="h-[300px]">
              <h4 className="font-semibold mb-2">Multi-Dimensional Risk Profile</h4>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  {results.map((r, i) => (
                    <Radar
                      key={r.id}
                      name={r.name}
                      dataKey={r.name}
                      stroke={colors[i % colors.length]}
                      fill={colors[i % colors.length]}
                      fillOpacity={0.2}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3">Bond</th>
                  <th className="text-right p-3">Maturity</th>
                  <th className="text-right p-3">Coupon</th>
                  <th className="text-right p-3">YTM</th>
                  <th className="text-right p-3">Price</th>
                  <th className="text-right p-3">Macaulay</th>
                  <th className="text-right p-3">Modified</th>
                  <th className="text-right p-3">DV01</th>
                  <th className="text-right p-3">Convexity</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.id} className="border-b hover:bg-muted/30">
                    <td className="p-3 font-medium">
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: colors[i % colors.length] }}
                      />
                      {r.name}
                    </td>
                    <td className="text-right p-3">{r.params.yearsToMaturity}Y</td>
                    <td className="text-right p-3">{(r.params.couponRate * 100).toFixed(2)}%</td>
                    <td className="text-right p-3">{(r.params.ytm * 100).toFixed(2)}%</td>
                    <td className="text-right p-3 font-mono">${r.results.price.toFixed(2)}</td>
                    <td className="text-right p-3 font-mono">
                      {r.results.macaulayDuration.toFixed(3)}
                    </td>
                    <td className="text-right p-3 font-mono font-semibold">
                      {r.results.modifiedDuration.toFixed(3)}
                    </td>
                    <td className="text-right p-3 font-mono">
                      ${r.results.dollarDuration.toFixed(4)}
                    </td>
                    <td className="text-right p-3 font-mono">{r.results.convexity.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Insights */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Analysis Insights</h4>
            <ul className="text-sm space-y-2">
              <li>
                <strong>Highest Duration Risk:</strong>{' '}
                {results.sort((a, b) => b.results.modifiedDuration - a.results.modifiedDuration)[0]
                  .name}{' '}
                (
                {results
                  .sort((a, b) => b.results.modifiedDuration - a.results.modifiedDuration)[0]
                  .results.modifiedDuration.toFixed(3)}
                )
              </li>
              <li>
                <strong>Highest Convexity:</strong>{' '}
                {results.sort((a, b) => b.results.convexity - a.results.convexity)[0].name} (
                {results
                  .sort((a, b) => b.results.convexity - a.results.convexity)[0]
                  .results.convexity.toFixed(2)}
                )
              </li>
              <li>
                <strong>Duration Spread:</strong>{' '}
                {(
                  Math.max(...results.map(r => r.results.modifiedDuration)) -
                  Math.min(...results.map(r => r.results.modifiedDuration))
                ).toFixed(3)}{' '}
                years
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
