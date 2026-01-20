/**
 * PriceTag Component
 * Displays price with market comparison and highlighting for below-market prices
 */

'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';

interface PriceTagProps {
  price: number;
  marketValue: number;
}

export function PriceTag({ price, marketValue }: PriceTagProps) {
  const isBelowMarket = price < marketValue;
  const difference = marketValue - price;
  const percentDiff = ((difference / marketValue) * 100).toFixed(0);

  return (
    <div className="space-y-2">
      {/* Main Price */}
      <div className="flex items-baseline gap-2">
        <span 
          className={`text-2xl font-bold ${
            isBelowMarket ? 'text-green-500' : 'text-foreground'
          }`}
        >
          ${price}
        </span>
        {isBelowMarket && (
          <span className="text-sm text-green-500 flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            {percentDiff}% below market
          </span>
        )}
      </div>

      {/* Market Comparison */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Market Value:</span>
        <span className="text-gray-300">${marketValue}</span>
        {!isBelowMarket && price > marketValue && (
          <span className="text-orange-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Above market
          </span>
        )}
      </div>

      {/* Deal Indicator */}
      {isBelowMarket && difference >= 50 && (
        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
          <span className="text-xs font-medium text-green-500">
            🔥 Great Deal - Save ${difference}
          </span>
        </div>
      )}
    </div>
  );
}
