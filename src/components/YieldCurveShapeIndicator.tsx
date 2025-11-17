import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react'
import { type YieldCurvePoint } from '@/utils/fred-api'

interface YieldCurveShapeIndicatorProps {
  yieldCurve: YieldCurvePoint[]
}

export function YieldCurveShapeIndicator({ yieldCurve }: YieldCurveShapeIndicatorProps) {
  // Calculate key spreads
  const rate2Y = yieldCurve.find((y) => y.maturity === '2Y')?.rate || 0
  const rate10Y = yieldCurve.find((y) => y.maturity === '10Y')?.rate || 0
  const rate3M = yieldCurve.find((y) => y.maturity === '3M')?.rate || 0
  const rate30Y = yieldCurve.find((y) => y.maturity === '30Y')?.rate || 0

  const spread2s10s = rate10Y - rate2Y
  const spread3m30y = rate30Y - rate3M

  // Determine curve shape
  const isInverted = spread2s10s < 0
  const isFlat = Math.abs(spread2s10s) < 0.25
  const isSteep = spread2s10s > 1.0

  // Get shape info
  const getShapeInfo = () => {
    if (isInverted) {
      return {
        label: 'INVERTED',
        description: 'Short-term rates exceed long-term rates',
        warning: 'Historically a recession warning signal',
        icon: <TrendingDown className="h-8 w-8" />,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-400',
        textColor: 'text-red-700',
        iconColor: 'text-red-600',
      }
    } else if (isFlat) {
      return {
        label: 'FLAT',
        description: 'Minimal difference between short and long-term rates',
        warning: 'Economic uncertainty',
        icon: <Minus className="h-8 w-8" />,
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-400',
        textColor: 'text-amber-700',
        iconColor: 'text-amber-600',
      }
    } else if (isSteep) {
      return {
        label: 'STEEP',
        description: 'Strong upward slope from short to long-term',
        warning: 'Typical of economic expansion expectations',
        icon: <TrendingUp className="h-8 w-8" />,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-400',
        textColor: 'text-green-700',
        iconColor: 'text-green-600',
      }
    } else {
      return {
        label: 'NORMAL',
        description: 'Healthy upward slope',
        warning: 'Normal market conditions',
        icon: <TrendingUp className="h-8 w-8" />,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-400',
        textColor: 'text-blue-700',
        iconColor: 'text-blue-600',
      }
    }
  }

  const shapeInfo = getShapeInfo()

  return (
    <Card className={`border-2 ${shapeInfo.borderColor} ${shapeInfo.bgColor}`}>
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Main indicator */}
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full ${shapeInfo.bgColor} ${shapeInfo.iconColor}`}>
              {shapeInfo.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-3xl font-bold ${shapeInfo.textColor}`}>
                  {shapeInfo.label}
                </h2>
                <span className={`text-lg ${shapeInfo.textColor}`}>Yield Curve</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{shapeInfo.description}</p>
              {isInverted && (
                <div className="flex items-center gap-1 mt-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600">{shapeInfo.warning}</span>
                </div>
              )}
            </div>
          </div>

          {/* Spreads */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
            <div className="p-3 bg-white/70 rounded-lg text-center">
              <div className="text-xs text-muted-foreground font-medium">2Y-10Y Spread</div>
              <div
                className={`text-2xl font-bold mt-1 ${spread2s10s < 0 ? 'text-red-600' : 'text-green-600'}`}
              >
                {spread2s10s > 0 ? '+' : ''}
                {(spread2s10s * 100).toFixed(0)} bps
              </div>
              <div className="text-xs text-muted-foreground">Key recession indicator</div>
            </div>
            <div className="p-3 bg-white/70 rounded-lg text-center">
              <div className="text-xs text-muted-foreground font-medium">3M-30Y Spread</div>
              <div
                className={`text-2xl font-bold mt-1 ${spread3m30y < 0 ? 'text-red-600' : 'text-green-600'}`}
              >
                {spread3m30y > 0 ? '+' : ''}
                {(spread3m30y * 100).toFixed(0)} bps
              </div>
              <div className="text-xs text-muted-foreground">Term premium</div>
            </div>
            <div className="p-3 bg-white/70 rounded-lg text-center">
              <div className="text-xs text-muted-foreground font-medium">Short-term (3M)</div>
              <div className="text-2xl font-bold mt-1">{rate3M.toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground">Fed policy expectations</div>
            </div>
            <div className="p-3 bg-white/70 rounded-lg text-center">
              <div className="text-xs text-muted-foreground font-medium">Long-term (30Y)</div>
              <div className="text-2xl font-bold mt-1">{rate30Y.toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground">Inflation expectations</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
