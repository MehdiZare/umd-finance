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

            <AccordionItem value="key-rate-duration">
              <AccordionTrigger>Key Rate Duration</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  <strong>Key Rate Duration</strong> measures the sensitivity of a bond&apos;s price to
                  changes in specific maturity points on the yield curve, rather than assuming
                  parallel shifts.
                </p>

                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <p className="font-bold mb-2">Concept:</p>
                  <p>Total Duration = Σ Key Rate Durations</p>
                  <p className="mt-2 text-xs">
                    The sum of all key rate durations equals the effective duration
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                  <p className="font-bold">Why Key Rate Duration Matters:</p>
                  <ul className="text-sm mt-2 list-disc list-inside space-y-1">
                    <li>Yield curves rarely shift in parallel</li>
                    <li>Different maturities respond differently to economic events</li>
                    <li>Essential for hedging non-parallel curve shifts</li>
                    <li>Used for curve flattening/steepening trades</li>
                  </ul>
                </div>

                <p>
                  <strong>Example:</strong> A 10-year Treasury bond has high key rate duration at
                  the 10-year point but zero exposure to 2-year rate changes.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="tips">
              <AccordionTrigger>TIPS and Inflation-Linked Bonds</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  <strong>Treasury Inflation-Protected Securities (TIPS)</strong> provide protection
                  against inflation by adjusting the principal based on CPI.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2">Nominal Treasury</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Fixed coupon and principal</li>
                        <li>• Yield includes inflation expectations</li>
                        <li>• Higher duration risk</li>
                        <li>• Better when inflation falls</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <h4 className="font-semibold mb-2">TIPS</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Principal adjusts with CPI</li>
                        <li>• Real yield (after inflation)</li>
                        <li>• Inflation hedge</li>
                        <li>• Better when inflation rises</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
                  <p className="font-bold">Breakeven Inflation Rate:</p>
                  <p className="font-mono text-sm mt-2">
                    Breakeven = Nominal Yield - TIPS Real Yield
                  </p>
                  <p className="text-sm mt-2">
                    This is the market&apos;s expectation for average inflation. If actual inflation
                    exceeds the breakeven rate, TIPS outperform nominal bonds.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="yield-strategies">
              <AccordionTrigger>Yield Curve Strategies</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-600">Bullet Strategy</h4>
                    <p className="text-sm">
                      Concentrate holdings around a specific maturity. Lower reinvestment risk,
                      suitable for liability matching.
                    </p>
                    <p className="text-xs bg-muted p-2 rounded mt-1">
                      Example: All bonds mature in 5-7 years
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-600">Barbell Strategy</h4>
                    <p className="text-sm">
                      Invest in short and long-term bonds, avoiding intermediate maturities. Higher
                      convexity, benefits from curve steepening.
                    </p>
                    <p className="text-xs bg-muted p-2 rounded mt-1">
                      Example: 50% in 2-year, 50% in 30-year bonds
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-purple-600">Ladder Strategy</h4>
                    <p className="text-sm">
                      Equal allocation across maturities. Provides regular liquidity, automatic
                      reinvestment, and reduced timing risk.
                    </p>
                    <p className="text-xs bg-muted p-2 rounded mt-1">
                      Example: Equal weights in 1Y, 2Y, 3Y, 4Y, 5Y bonds
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="font-bold">Strategy Selection:</p>
                  <ul className="text-sm mt-2 list-disc list-inside">
                    <li>
                      <strong>Bullet:</strong> When you have specific future liabilities
                    </li>
                    <li>
                      <strong>Barbell:</strong> When expecting yield curve steepening
                    </li>
                    <li>
                      <strong>Ladder:</strong> For regular income and reduced risk
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="credit-spreads">
              <AccordionTrigger>Credit Spreads and Spread Duration</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  <strong>Credit Spread</strong> is the additional yield over risk-free treasuries
                  that compensates investors for credit (default) risk.
                </p>

                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <p className="font-bold mb-2">Credit Spread Formula:</p>
                  <p>Credit Spread = Corporate Bond Yield - Treasury Yield (same maturity)</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Spread Duration</h4>
                    <p className="text-sm">
                      Measures price sensitivity to changes in credit spreads. For corporate bonds,
                      spread duration is typically similar to modified duration but measures
                      response to spread changes rather than interest rate changes.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                      <p className="font-semibold text-sm">Investment Grade</p>
                      <p className="text-xs">BBB or higher rated</p>
                      <p className="text-xs mt-1">Typical spread: 50-200 bps</p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-950 rounded">
                      <p className="font-semibold text-sm">High Yield (Junk)</p>
                      <p className="text-xs">BB or lower rated</p>
                      <p className="text-xs mt-1">Typical spread: 300-800 bps</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                  <p className="font-bold">Spread Widening Risk:</p>
                  <p className="text-sm mt-2">
                    During economic stress, credit spreads widen (increase), causing corporate bond
                    prices to fall even if treasury yields remain stable. This is why corporate
                    bonds often underperform treasuries during crises.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="roll-down">
              <AccordionTrigger>Roll Down Return and Carry</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  <strong>Roll Down Return</strong> is the price appreciation that occurs as a bond
                  &quot;rolls down&quot; the yield curve over time, assuming the curve shape remains
                  constant.
                </p>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-bold mb-2">Example (Normal Upward-Sloping Curve):</p>
                  <p className="text-sm">
                    A 10-year bond yielding 4.0% today. One year later, it becomes a 9-year bond.
                    If 9-year yields are 3.8%, the bond price increases even without rate changes.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Total Return Components:</h4>
                    <ul className="text-sm list-disc list-inside space-y-1">
                      <li>
                        <strong>Carry:</strong> Coupon income (current yield)
                      </li>
                      <li>
                        <strong>Roll Down:</strong> Price change from curve positioning
                      </li>
                      <li>
                        <strong>Rate Change:</strong> Impact of yield movements
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <p className="font-bold">Strategy Implication:</p>
                  <p className="text-sm mt-2">
                    When the yield curve is steep, intermediate bonds (5-10 years) often provide
                    the best roll-down return. This is why many active managers favor this part of
                    the curve.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
