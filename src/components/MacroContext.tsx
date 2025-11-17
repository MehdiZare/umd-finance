import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

interface MacroIndicator {
  seriesId: string;
  name: string;
  value: number;
  unit: string;
  description: string;
  url: string;
  date: string;
}

interface MacroResponse {
  data: MacroIndicator[];
  source: string;
  timestamp: string;
}

export function MacroContext() {
  const [indicators, setIndicators] = useState<MacroIndicator[]>([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/macro');
      if (!response.ok) throw new Error('Failed to fetch');
      const data: MacroResponse = await response.json();
      setIndicators(data.data);
      setSource(data.source);
      setLastUpdated(new Date(data.timestamp));
    } catch (err) {
      console.warn('Failed to fetch macro data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper to format values nicely
  const formatValue = (indicator: MacroIndicator) => {
    if (indicator.unit === 'B USD') {
      return `$${indicator.value.toFixed(0)}B`;
    }
    if (indicator.unit === 'Index') {
      return indicator.value.toFixed(1);
    }
    return `${indicator.value.toFixed(2)}%`;
  };

  // Interpret the indicator for educational purposes
  const getInsight = (indicator: MacroIndicator): string => {
    switch (indicator.seriesId) {
      case 'UNRATE':
        if (indicator.value < 4) return 'Tight labor market - wage pressure';
        if (indicator.value > 5) return 'Elevated - economic weakness';
        return 'Near natural rate';
      case 'PCEPILFE':
        if (indicator.value > 2.5) return 'Above Fed 2% target - hawkish';
        if (indicator.value < 2) return 'Below target - dovish';
        return 'Near Fed target';
      case 'CPIAUCSL':
        if (indicator.value > 3) return 'Elevated inflation pressure';
        if (indicator.value < 2) return 'Low inflation/disinflation';
        return 'Moderate inflation';
      case 'A191RL1Q225SBEA':
        if (indicator.value > 3) return 'Strong growth';
        if (indicator.value < 1) return 'Weak growth - recession risk';
        return 'Trend growth';
      case 'VIXCLS':
        if (indicator.value > 25) return 'High volatility - risk-off';
        if (indicator.value < 15) return 'Low volatility - complacency';
        return 'Normal volatility';
      case 'WALCL':
        if (indicator.value > 7000) return 'Quantitative easing';
        if (indicator.value < 5000) return 'Quantitative tightening';
        return 'Balance sheet normalization';
      case 'MORTGAGE30US':
        if (indicator.value > 7) return 'Restrictive - housing slowdown';
        if (indicator.value < 5) return 'Accommodative - housing boom';
        return 'Moderate financing costs';
      default:
        return '';
    }
  };

  // Get icon for trend
  const getTrendIcon = (indicator: MacroIndicator) => {
    // These are rough guidelines for what direction matters
    const neutralIndicators = ['VIXCLS', 'WALCL'];
    if (neutralIndicators.includes(indicator.seriesId)) {
      return <Activity className="h-4 w-4 text-muted-foreground" />;
    }

    const higherIsBad = ['UNRATE', 'PCEPILFE', 'CPIAUCSL', 'MORTGAGE30US'];
    if (higherIsBad.includes(indicator.seriesId)) {
      // For these, lower is better
      const thresholds: Record<string, number> = {
        UNRATE: 4,
        PCEPILFE: 2.5,
        CPIAUCSL: 2.5,
        MORTGAGE30US: 6,
      };
      const threshold = thresholds[indicator.seriesId] || 0;
      if (indicator.value > threshold) {
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      }
      return <TrendingDown className="h-4 w-4 text-green-500" />;
    }

    // GDP growth - higher is better
    if (indicator.seriesId === 'A191RL1Q225SBEA') {
      if (indicator.value > 2) {
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      }
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }

    return <Activity className="h-4 w-4 text-muted-foreground" />;
  };

  if (indicators.length === 0 && !loading) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Macroeconomic Context
            </CardTitle>
            <CardDescription>
              Key economic indicators that influence interest rates and bond prices
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mt-2">
            Data from {source} | Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {indicators.map(indicator => (
            <a
              key={indicator.seriesId}
              href={indicator.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {indicator.name}
                </span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(indicator)}
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="text-2xl font-bold">{formatValue(indicator)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {getInsight(indicator)}
              </div>
              <div className="text-xs text-muted-foreground/60 mt-1">
                As of {new Date(indicator.date).toLocaleDateString()}
              </div>
            </a>
          ))}
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="font-semibold text-blue-900 text-sm">Understanding the Context:</p>
          <p className="text-xs text-blue-800 mt-1">
            These indicators help explain <strong>why</strong> interest rates move. The Fed monitors
            inflation (PCE, CPI) and employment (unemployment rate) to set policy. Strong GDP growth
            with low inflation supports lower rates, while high inflation with low unemployment
            suggests tighter policy. The VIX shows market stress, and the Fed&apos;s balance sheet
            reflects quantitative easing/tightening. Mortgage rates demonstrate how Treasury rates
            transmit to consumers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
