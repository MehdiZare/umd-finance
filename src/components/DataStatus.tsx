import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
  Info,
  Clock,
  Database,
  Wifi,
  WifiOff,
} from 'lucide-react';

export type DataSourceStatus = 'idle' | 'loading' | 'success' | 'error' | 'cached';

interface DataStatusProps {
  status: DataSourceStatus;
  source: string;
  lastUpdated?: Date;
  errorMessage?: string;
  onRetry?: () => void;
  dataAge?: number; // in minutes
}

export function DataStatusBadge({ status, source, lastUpdated, onRetry }: DataStatusProps) {
  const statusConfig = {
    idle: {
      icon: Database,
      text: 'Ready',
      className: 'bg-muted text-muted-foreground',
    },
    loading: {
      icon: RefreshCw,
      text: 'Fetching...',
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    },
    success: {
      icon: CheckCircle,
      text: 'Live Data',
      className: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    },
    error: {
      icon: AlertTriangle,
      text: 'Using Sample',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
    cached: {
      icon: Clock,
      text: 'Cached',
      className: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className={`h-3 w-3 ${status === 'loading' ? 'animate-spin' : ''}`} />
        {config.text}
      </div>
      <span className="text-xs text-muted-foreground">
        {source}
        {lastUpdated && status === 'success' && (
          <> | Updated {lastUpdated.toLocaleTimeString()}</>
        )}
      </span>
      {status === 'error' && onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry} className="h-6 text-xs">
          Retry
        </Button>
      )}
    </div>
  );
}

export function DataSourceInfo() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Data Source Information</p>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span>Network Status: {isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                <strong>Live Data:</strong> Retrieved from FRED (Federal Reserve Economic Data) API
              </li>
              <li>
                <strong>Sample Data:</strong> Historical snapshot used when API is unavailable
              </li>
              <li>
                <strong>Update Frequency:</strong> Treasury rates updated daily by FRED
              </li>
              <li>
                <strong>No API Key Required:</strong> Public data access (may have rate limits)
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({ isLoading, message = 'Loading data...' }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ title = 'Data Unavailable', message, onRetry }: ErrorMessageProps) {
  return (
    <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
      <div className="flex items-start gap-3">
        <XCircle className="h-5 w-5 text-destructive mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-destructive">{title}</p>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="mt-3 gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface SuccessMessageProps {
  message: string;
  timestamp?: Date;
}

export function SuccessMessage({ message, timestamp }: SuccessMessageProps) {
  return (
    <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <p className="text-sm font-medium text-green-700 dark:text-green-300">{message}</p>
        {timestamp && (
          <span className="text-xs text-green-600 dark:text-green-400 ml-auto">
            {timestamp.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}
