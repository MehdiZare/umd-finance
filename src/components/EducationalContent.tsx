import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Calculator, BarChart3, Shield } from 'lucide-react';

export function EducationalContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Understanding Bond Duration
          </CardTitle>
          <CardDescription>Key concepts for Master of Finance students</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-duration">
              <AccordionTrigger>What is Duration?</AccordionTrigger>
              <AccordionContent className="prose prose-sm max-w-none">
                <p>
                  <strong>Duration</strong> measures the sensitivity of a bond's price to changes in
                  interest rates. It can be interpreted in two ways:
                </p>
                <ol>
                  <li>
                    <strong>Time Measure:</strong> The weighted average time until cash flows are
                    received
                  </li>
                  <li>
                    <strong>Risk Measure:</strong> The percentage change in price for a 1% change
                    in yield
                  </li>
                </ol>
                <p>
                  The higher the duration, the more sensitive the bond is to interest rate changes,
                  meaning greater interest rate risk.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="macaulay">
              <AccordionTrigger className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Macaulay Duration
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  <strong>Macaulay Duration</strong> is the weighted average time to receive all
                  cash flows, where weights are the present values of each cash flow.
                </p>

                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <p className="font-bold mb-2">Formula:</p>
                  <p>D<sub>Mac</sub> = Σ (t × PV(CF<sub>t</sub>)) / P</p>
                  <p className="mt-2 text-xs">
                    Where:
                    <br />• t = time to cash flow (in years)
                    <br />• PV(CF<sub>t</sub>) = present value of cash flow at time t<br />• P =
                    current bond price
                  </p>
                </div>

                <p>
                  <strong>Key Properties:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Always less than or equal to the bond's maturity</li>
                  <li>Equals maturity for zero-coupon bonds</li>
                  <li>Measured in years</li>
                  <li>Higher for bonds with lower coupon rates</li>
                  <li>Higher for bonds with longer maturities</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="modified">
              <AccordionTrigger>Modified Duration</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  <strong>Modified Duration</strong> measures the percentage price change for a 1%
                  change in yield. It's the most commonly used duration measure for risk management.
                </p>

                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <p className="font-bold mb-2">Formula:</p>
                  <p>
                    D<sub>Mod</sub> = D<sub>Mac</sub> / (1 + y/k)
                  </p>
                  <p className="mt-2 text-xs">
                    Where:
                    <br />• D<sub>Mac</sub> = Macaulay Duration
                    <br />• y = yield to maturity
                    <br />• k = number of compounding periods per year
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="font-bold">Price Approximation:</p>
                  <p className="font-mono mt-2">ΔP/P ≈ -D<sub>Mod</sub> × Δy</p>
                  <p className="text-sm mt-2">
                    Example: If Modified Duration = 7.5 and yields increase by 1% (100 bps), the
                    bond price will decrease by approximately 7.5%.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="dollar-duration">
              <AccordionTrigger>Dollar Duration (DV01)</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  <strong>Dollar Duration (DV01)</strong> measures the dollar change in price for a
                  1 basis point (0.01%) change in yield.
                </p>

                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <p className="font-bold mb-2">Formula:</p>
                  <p>DV01 = Modified Duration × Price / 10,000</p>
                  <p className="mt-2 text-xs">
                    Also called "PVBP" (Price Value of a Basis Point) or "Dollar Value of 01"
                  </p>
                </div>

                <p>
                  <strong>Why DV01 Matters:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Essential for hedging portfolios</li>
                  <li>Used to measure portfolio risk exposure</li>
                  <li>Helps determine hedge ratios</li>
                  <li>Key metric for fixed income traders</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="convexity">
              <AccordionTrigger className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Convexity
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  <strong>Convexity</strong> is the second derivative of the price-yield
                  relationship. It measures how duration changes as yields change, capturing the
                  curvature of the price-yield curve.
                </p>

                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <p className="font-bold mb-2">Price Change Formula (with Convexity):</p>
                  <p>
                    ΔP/P ≈ -D<sub>Mod</sub> × Δy + ½ × Convexity × (Δy)²
                  </p>
                </div>

                <p>
                  <strong>Key Insights:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <strong>Positive Convexity:</strong> Bond prices increase more when yields fall
                    than they decrease when yields rise (favorable for investors)
                  </li>
                  <li>Duration alone underestimates gains and overestimates losses</li>
                  <li>Higher convexity = better for investors (all else equal)</li>
                  <li>More important for larger yield changes</li>
                </ul>

                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <p className="font-bold">The Convexity Benefit:</p>
                  <p className="text-sm mt-2">
                    Investors prefer high convexity because it provides asymmetric price behavior:
                    you gain more when rates fall than you lose when rates rise (for equal rate
                    movements).
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="factors">
              <AccordionTrigger>Factors Affecting Duration</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2">↑ Increase Duration</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Longer maturity</li>
                        <li>• Lower coupon rate</li>
                        <li>• Lower yield to maturity</li>
                        <li>• Less frequent coupon payments</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2">↓ Decrease Duration</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Shorter maturity</li>
                        <li>• Higher coupon rate</li>
                        <li>• Higher yield to maturity</li>
                        <li>• More frequent coupon payments</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                  <p className="font-semibold">Remember:</p>
                  <p className="text-sm">
                    Zero-coupon bonds have the highest duration for a given maturity because all
                    cash flow is received at maturity. For a zero-coupon bond, Macaulay Duration =
                    Time to Maturity.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="applications">
              <AccordionTrigger className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Risk Management Applications
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">1. Immunization</h4>
                    <p className="text-sm">
                      Match the duration of assets to the duration of liabilities to protect
                      against interest rate risk. Common in pension fund management.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">2. Duration Gap Analysis</h4>
                    <p className="text-sm">
                      Banks use duration gap to measure exposure to interest rate changes:
                    </p>
                    <p className="font-mono text-xs bg-muted p-2 rounded mt-1">
                      Duration Gap = D<sub>assets</sub> - (L/A) × D<sub>liabilities</sub>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">3. Hedging</h4>
                    <p className="text-sm">
                      Use DV01 to calculate the number of futures contracts needed to hedge a bond
                      position:
                    </p>
                    <p className="font-mono text-xs bg-muted p-2 rounded mt-1">
                      Hedge Ratio = DV01<sub>portfolio</sub> / DV01<sub>hedge instrument</sub>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">4. Portfolio Construction</h4>
                    <p className="text-sm">
                      Target a specific portfolio duration based on your interest rate outlook and
                      risk tolerance. Increase duration when expecting rates to fall; decrease
                      when expecting rates to rise.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="limitations">
              <AccordionTrigger>Limitations of Duration</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Linear Approximation:</strong> Duration assumes a linear price-yield
                    relationship, which is only accurate for small yield changes
                  </li>
                  <li>
                    <strong>Parallel Shifts:</strong> Assumes the entire yield curve shifts by the
                    same amount (parallel shift)
                  </li>
                  <li>
                    <strong>No Embedded Options:</strong> Standard duration doesn't account for
                    embedded options (use effective duration instead)
                  </li>
                  <li>
                    <strong>Continuous Rebalancing:</strong> Immunization strategies require
                    periodic rebalancing as duration changes over time
                  </li>
                  <li>
                    <strong>Credit Risk:</strong> Duration measures only interest rate risk, not
                    credit or liquidity risk
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="effective-duration">
              <AccordionTrigger>Effective Duration vs. Modified Duration</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  <strong>Effective Duration</strong> is used for bonds with embedded options
                  (callable, putable bonds) where cash flows can change with interest rates.
                </p>

                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <p className="font-bold mb-2">Effective Duration Formula:</p>
                  <p>
                    D<sub>Eff</sub> = (P<sub>-Δy</sub> - P<sub>+Δy</sub>) / (2 × P<sub>0</sub> ×
                    Δy)
                  </p>
                  <p className="mt-2 text-xs">
                    Uses actual price changes from a pricing model that accounts for embedded
                    options
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Modified Duration</h4>
                    <ul className="text-sm list-disc list-inside">
                      <li>Analytical (formula-based)</li>
                      <li>For option-free bonds</li>
                      <li>Cash flows are fixed</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Effective Duration</h4>
                    <ul className="text-sm list-disc list-inside">
                      <li>Numerical (model-based)</li>
                      <li>For bonds with options</li>
                      <li>Cash flows may change</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
