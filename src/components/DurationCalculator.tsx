import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculateDuration, type BondParams, type DurationResults } from '@/utils/duration';
import { Info, TrendingDown, TrendingUp, Clock, DollarSign } from 'lucide-react';

export function DurationCalculator() {
  const [params, setParams] = useState<BondParams>({
    faceValue: 1000,
    couponRate: 0.05,
    yearsToMaturity: 10,
    ytm: 0.05,
    frequency: 2,
  });

  const [results, setResults] = useState<DurationResults | null>(null);

  useEffect(() => {
    const newResults = calculateDuration(params);
    setResults(newResults);
  }, [params]);

  const updateParam = (key: keyof BondParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Interactive Duration Calculator
        </CardTitle>
        <CardDescription>
          Adjust bond parameters to see how they affect duration and price sensitivity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Controls */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Face Value ($)</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[params.faceValue]}
                    onValueChange={([v]) => updateParam('faceValue', v)}
                    min={100}
                    max={10000}
                    step={100}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={params.faceValue}
                    onChange={e => updateParam('faceValue', Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">
                  Coupon Rate: {(params.couponRate * 100).toFixed(2)}%
                </Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[params.couponRate * 100]}
                    onValueChange={([v]) => updateParam('couponRate', v / 100)}
                    min={0}
                    max={15}
                    step={0.25}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={(params.couponRate * 100).toFixed(2)}
                    onChange={e => updateParam('couponRate', Number(e.target.value) / 100)}
                    className="w-24"
                    step={0.25}
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">
                  Years to Maturity: {params.yearsToMaturity}
                </Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[params.yearsToMaturity]}
                    onValueChange={([v]) => updateParam('yearsToMaturity', v)}
                    min={1}
                    max={30}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={params.yearsToMaturity}
                    onChange={e => updateParam('yearsToMaturity', Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">
                  Yield to Maturity: {(params.ytm * 100).toFixed(2)}%
                </Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[params.ytm * 100]}
                    onValueChange={([v]) => updateParam('ytm', v / 100)}
                    min={0.5}
                    max={15}
                    step={0.25}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={(params.ytm * 100).toFixed(2)}
                    onChange={e => updateParam('ytm', Number(e.target.value) / 100)}
                    className="w-24"
                    step={0.25}
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">Payment Frequency</Label>
                <Tabs
                  value={String(params.frequency)}
                  onValueChange={v => updateParam('frequency', Number(v))}
                  className="mt-2"
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="1">Annual</TabsTrigger>
                    <TabsTrigger value="2">Semi-Annual</TabsTrigger>
                    <TabsTrigger value="4">Quarterly</TabsTrigger>
                    <TabsTrigger value="12">Monthly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="space-y-4">
            {results && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-primary/5">
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground">Bond Price</div>
                      <div className="text-2xl font-bold text-primary">
                        ${results.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {results.price > params.faceValue ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            Premium Bond
                          </span>
                        ) : results.price < params.faceValue ? (
                          <span className="flex items-center gap-1 text-red-600">
                            <TrendingDown className="h-3 w-3" />
                            Discount Bond
                          </span>
                        ) : (
                          'Par Bond'
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-primary/5">
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        Macaulay Duration
                        <Info className="h-3 w-3" />
                      </div>
                      <div className="text-2xl font-bold">
                        {results.macaulayDuration.toFixed(3)} yrs
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Weighted average time to receive cash flows
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary/10">
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground">Modified Duration</div>
                      <div className="text-2xl font-bold">
                        {results.modifiedDuration.toFixed(3)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        % price change per 1% yield change
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary/10">
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Dollar Duration (DV01)
                      </div>
                      <div className="text-2xl font-bold">
                        ${results.dollarDuration.toFixed(4)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        $ change per 1bp yield change
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-2 bg-accent/10">
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground">Convexity</div>
                      <div className="text-2xl font-bold">{results.convexity.toFixed(4)}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Measures curvature of price-yield relationship (second-order effect)
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Key Insights */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Key Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <strong>Interest Rate Risk:</strong> A{' '}
                      <span className="text-red-600">1%</span> increase in yield would cause an
                      approximate{' '}
                      <span className="text-red-600 font-semibold">
                        {results.modifiedDuration.toFixed(2)}%
                      </span>{' '}
                      decrease in bond price.
                    </p>
                    <p>
                      <strong>Price Sensitivity:</strong> For every{' '}
                      <span className="text-primary">1 basis point</span> (0.01%) change in yield,
                      the bond price changes by{' '}
                      <span className="font-semibold">${results.dollarDuration.toFixed(4)}</span>.
                    </p>
                    <p>
                      <strong>Convexity Effect:</strong> Higher convexity (
                      {results.convexity.toFixed(2)}) means the bond will{' '}
                      <span className="text-green-600">outperform</span> the duration estimate for
                      large yield changes.
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
