import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { DurationCalculator } from '@/components/DurationCalculator';
import { PriceYieldChart } from '@/components/PriceYieldChart';
import { CashFlowTable } from '@/components/CashFlowTable';
import { PriceSensitivity } from '@/components/PriceSensitivity';
import { TreasuryData } from '@/components/TreasuryData';
import { EducationalContent } from '@/components/EducationalContent';
import { BondComparison } from '@/components/BondComparison';
import { calculateDuration, type BondParams } from '@/utils/duration';
import {
  Calculator,
  LineChart,
  GraduationCap,
  TrendingUp,
  Scale,
  Github,
} from 'lucide-react';

function App() {
  const [bondParams] = useState<BondParams>({
    faceValue: 1000,
    couponRate: 0.05,
    yearsToMaturity: 10,
    ytm: 0.05,
    frequency: 2,
  });

  const results = calculateDuration(bondParams);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Calculator className="h-7 w-7" />
                  Bond Duration Calculator
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Interactive educational tool for Master of Finance students
                </p>
              </div>
              <div className="flex items-center gap-4">
                <a
                  href="https://fred.stlouisfed.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Data from FRED
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <Tabs defaultValue="calculator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="calculator" className="gap-2">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Calculator</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="gap-2">
                <LineChart className="h-4 w-4" />
                <span className="hidden sm:inline">Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="treasury" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Treasury</span>
              </TabsTrigger>
              <TabsTrigger value="compare" className="gap-2">
                <Scale className="h-4 w-4" />
                <span className="hidden sm:inline">Compare</span>
              </TabsTrigger>
              <TabsTrigger value="learn" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Learn</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-6">
              <div className="grid gap-6">
                <DurationCalculator />
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <div className="grid gap-6">
                {/* Bond Parameter Summary */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">Current Bond Parameters</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Face Value:</span>
                      <div className="font-mono">${bondParams.faceValue}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Coupon Rate:</span>
                      <div className="font-mono">{(bondParams.couponRate * 100).toFixed(2)}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Maturity:</span>
                      <div className="font-mono">{bondParams.yearsToMaturity} years</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">YTM:</span>
                      <div className="font-mono">{(bondParams.ytm * 100).toFixed(2)}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Frequency:</span>
                      <div className="font-mono">
                        {bondParams.frequency === 1
                          ? 'Annual'
                          : bondParams.frequency === 2
                            ? 'Semi-Annual'
                            : bondParams.frequency === 4
                              ? 'Quarterly'
                              : 'Monthly'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">
                      Note: Analysis uses default bond parameters. Customize in the Calculator tab.
                    </p>
                  </div>
                </div>

                <PriceSensitivity params={bondParams} />
                <PriceYieldChart params={bondParams} />
                <CashFlowTable
                  cashFlows={results.cashFlows}
                  macaulayDuration={results.macaulayDuration}
                />
              </div>
            </TabsContent>

            <TabsContent value="treasury" className="space-y-6">
              <TreasuryData />
            </TabsContent>

            <TabsContent value="compare" className="space-y-6">
              <BondComparison />
            </TabsContent>

            <TabsContent value="learn" className="space-y-6">
              <EducationalContent />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t bg-card mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <p>Educational tool for fixed income analysis and duration concepts.</p>
                <p className="mt-1">
                  Built for Master of Finance students. Data sourced from{' '}
                  <a
                    href="https://fred.stlouisfed.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    FRED (Federal Reserve Economic Data)
                  </a>
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>
                  Disclaimer: This tool is for educational purposes only. Not financial advice.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}

export default App;
