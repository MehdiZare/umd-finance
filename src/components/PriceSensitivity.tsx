import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { calculateDuration, calculatePriceChange, type BondParams } from '@/utils/duration';
import { ArrowDown, ArrowUp, Target } from 'lucide-react';

interface PriceSensitivityProps {
  params: BondParams;
}

export function PriceSensitivity({ params }: PriceSensitivityProps) {
  const [yieldChangeBps, setYieldChangeBps] = useState(100); // Default 100 bps = 1%

  const results = useMemo(() => calculateDuration(params), [params]);
  const priceChange = useMemo(
    () => calculatePriceChange(params, yieldChangeBps),
    [params, yieldChangeBps]
  );
  const priceChangeDown = useMemo(
    () => calculatePriceChange(params, -yieldChangeBps),
    [params, yieldChangeBps]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Price Sensitivity Analysis
        </CardTitle>
        <CardDescription>
          See how bond price changes with interest rate movements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Yield Change Slider */}
          <div>
            <Label className="text-base font-semibold">
              Yield Change: {yieldChangeBps > 0 ? '+' : ''}
              {yieldChangeBps} bps ({(yieldChangeBps / 100).toFixed(2)}%)
            </Label>
            <Slider
              value={[yieldChangeBps]}
              onValueChange={([v]) => setYieldChangeBps(v)}
              min={-500}
              max={500}
              step={25}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>-500 bps (-5%)</span>
              <span>0</span>
              <span>+500 bps (+5%)</span>
            </div>
          </div>

          {/* Current Bond Info */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-xl font-bold">${results.price.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Current YTM</p>
              <p className="text-xl font-bold">{(params.ytm * 100).toFixed(2)}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Modified Duration</p>
              <p className="text-xl font-bold">{results.modifiedDuration.toFixed(3)}</p>
            </div>
          </div>

          {/* Price Change Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Yield Increase */}
            <Card className={yieldChangeBps >= 0 ? 'ring-2 ring-primary' : ''}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowUp className="h-5 w-5 text-red-500" />
                  <h4 className="font-semibold">
                    Yield {yieldChangeBps >= 0 ? 'Increase' : 'Decrease'} (+{yieldChangeBps} bps)
                  </h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>New YTM:</span>
                    <span className="font-mono">
                      {(params.ytm * 100 + yieldChangeBps / 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actual New Price:</span>
                    <span className="font-mono font-semibold">
                      ${priceChange.newPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Price Change:</span>
                    <span className="font-mono">
                      {priceChange.dollarChange > 0 ? '+' : ''}$
                      {priceChange.dollarChange.toFixed(2)} ({priceChange.percentChange.toFixed(2)}
                      %)
                    </span>
                  </div>
                  <hr className="border-dashed" />
                  <div className="flex justify-between text-muted-foreground">
                    <span>Duration Estimate:</span>
                    <span className="font-mono">${priceChange.durationApprox.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>With Convexity:</span>
                    <span className="font-mono">${priceChange.withConvexity.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Duration Error:</span>
                    <span className="font-mono text-amber-600">
                      $
                      {Math.abs(priceChange.dollarChange - priceChange.durationApprox).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Convexity Error:</span>
                    <span className="font-mono text-green-600">
                      $
                      {Math.abs(priceChange.dollarChange - priceChange.withConvexity).toFixed(4)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Yield Decrease */}
            <Card className={yieldChangeBps < 0 ? 'ring-2 ring-primary' : ''}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowDown className="h-5 w-5 text-green-500" />
                  <h4 className="font-semibold">Yield Decrease (-{yieldChangeBps} bps)</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>New YTM:</span>
                    <span className="font-mono">
                      {Math.max(0.1, params.ytm * 100 - yieldChangeBps / 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actual New Price:</span>
                    <span className="font-mono font-semibold">
                      ${priceChangeDown.newPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Price Change:</span>
                    <span className="font-mono">
                      {priceChangeDown.dollarChange > 0 ? '+' : ''}$
                      {priceChangeDown.dollarChange.toFixed(2)} (
                      {priceChangeDown.percentChange.toFixed(2)}%)
                    </span>
                  </div>
                  <hr className="border-dashed" />
                  <div className="flex justify-between text-muted-foreground">
                    <span>Duration Estimate:</span>
                    <span className="font-mono">${priceChangeDown.durationApprox.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>With Convexity:</span>
                    <span className="font-mono">${priceChangeDown.withConvexity.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Duration Error:</span>
                    <span className="font-mono text-amber-600">
                      $
                      {Math.abs(
                        priceChangeDown.dollarChange - priceChangeDown.durationApprox
                      ).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Convexity Error:</span>
                    <span className="font-mono text-green-600">
                      $
                      {Math.abs(
                        priceChangeDown.dollarChange - priceChangeDown.withConvexity
                      ).toFixed(4)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Observation */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-semibold mb-2">Key Observation: Convexity Benefit</h4>
            <p className="text-sm">
              Notice that when yields decrease, the price increase (
              <span className="text-green-600 font-semibold">
                +${priceChangeDown.dollarChange.toFixed(2)}
              </span>
              ) is <strong>larger</strong> than the price decrease (
              <span className="text-red-600 font-semibold">
                ${Math.abs(priceChange.dollarChange).toFixed(2)}
              </span>
              ) for an equal yield change. This asymmetry is the{' '}
              <strong>convexity benefit</strong> - positive convexity is favorable for bond
              investors.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
