'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DurationCalculator } from '@/components/DurationCalculator'
import { PriceYieldChart } from '@/components/PriceYieldChart'
import { CashFlowTable } from '@/components/CashFlowTable'
import { PriceSensitivity } from '@/components/PriceSensitivity'
import { TreasuryData } from '@/components/TreasuryData'
import { EducationalContent } from '@/components/EducationalContent'
import { BondComparison } from '@/components/BondComparison'
import { YieldCurveShapeIndicator } from '@/components/YieldCurveShapeIndicator'
import { calculateDuration, type BondParams } from '@/utils/duration'
import { fetchTreasuryData, getMockYieldCurve, type YieldCurvePoint } from '@/utils/fred-api'
import {
  Calculator,
  GraduationCap,
  TrendingUp,
  Scale,
  Github,
} from 'lucide-react'

export default function HomePage() {
  const [bondParams, setBondParams] = useState<BondParams>({
    faceValue: 1000,
    couponRate: 0.05,
    yearsToMaturity: 10,
    ytm: 0.05,
    frequency: 2,
  })

  const [yieldCurve, setYieldCurve] = useState<YieldCurvePoint[]>(getMockYieldCurve())

  const results = calculateDuration(bondParams)

  // Fetch yield curve data on mount
  useEffect(() => {
    const loadYieldCurve = async () => {
      try {
        const response = await fetchTreasuryData()
        if (response.data.length > 0) {
          setYieldCurve(response.data)
        }
      } catch (error) {
        console.warn('Failed to fetch yield curve, using sample data:', error)
      }
    }
    loadYieldCurve()
  }, [])

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
                  href="https://github.com/MehdiZare/umd-finance"
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
          <Tabs defaultValue="analysis" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="analysis" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Analysis</span>
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

            <TabsContent value="analysis" className="space-y-6">
              {/* Prominent Yield Curve Shape Indicator at the top */}
              <YieldCurveShapeIndicator yieldCurve={yieldCurve} />

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left: Calculator Input & Results */}
                <div>
                  <DurationCalculator params={bondParams} onParamsChange={setBondParams} />
                </div>

                {/* Right: Analysis Visualizations */}
                <div className="space-y-6">
                  <PriceSensitivity params={bondParams} />
                  <PriceYieldChart params={bondParams} />
                </div>
              </div>

              {/* Full width: Cash Flow Table */}
              <CashFlowTable
                cashFlows={results.cashFlows}
                macaulayDuration={results.macaulayDuration}
              />

              {/* Treasury Analysis */}
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
  )
}
