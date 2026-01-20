/**
 * ErrorScreen Component
 * Designed error screen with helpful messages
 * Validates: Requirements 15.5
 */

'use client';

import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

export interface ErrorScreenProps {
  error?: Error | null;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  onRetry?: () => void;
  onGoHome?: () => void;
}

/**
 * ErrorScreen component displays a designed error state
 * with helpful messages and recovery options
 */
export function ErrorScreen({
  error,
  title = 'Something went wrong',
  message,
  showHomeButton = true,
  showRefreshButton = true,
  onRetry,
  onGoHome,
}: ErrorScreenProps) {
  // Generate user-friendly message based on error
  const errorMessage = message || getErrorMessage(error);
  
  const handleRefresh = () => {
    if (onRetry) {
      onRetry();
    } else {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  };
  
  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      // Fallback to navigate to feed
      if (typeof window !== 'undefined') {
        window.location.href = '/feed';
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
        
        {/* Error Title */}
        <h1 className="text-2xl font-bold text-foreground mb-3">
          {title}
        </h1>
        
        {/* Error Message */}
        <p className="text-gray-400 mb-8">
          {errorMessage}
        </p>
        
        {/* Error Details (in development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400 mb-2">
              Technical Details
            </summary>
            <pre className="text-xs bg-card p-4 rounded-lg overflow-auto text-red-400">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRefreshButton && (
            <Button
              onClick={handleRefresh}
              variant="primary"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
          
          {showHomeButton && (
            <Button
              onClick={handleGoHome}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Generate user-friendly error message based on error type
 */
function getErrorMessage(error?: Error | null): string {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }
  
  const errorMessage = error.message.toLowerCase();
  
  // Network errors
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Unable to connect. Please check your internet connection and try again.';
  }
  
  // Not found errors
  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return 'The content you\'re looking for doesn\'t exist or has been removed.';
  }
  
  // Authentication errors
  if (errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
    return 'Your session has expired. Please log in again.';
  }
  
  // Timeout errors
  if (errorMessage.includes('timeout')) {
    return 'The request took too long. Please try again.';
  }
  
  // Default message
  return 'Something went wrong. Please try again or contact support if the problem persists.';
}
