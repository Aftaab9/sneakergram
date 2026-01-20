/**
 * RentOption Component
 * Displays rental-specific information including daily price, dates, and deposit
 */

'use client';

import { Calendar, DollarSign, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface RentOptionProps {
  rentPrice: number;
  rentDeposit: number;
  availableFrom: Date;
  availableTo: Date;
}

export function RentOption({ 
  rentPrice, 
  rentDeposit, 
  availableFrom, 
  availableTo 
}: RentOptionProps) {
  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };

  const getDaysAvailable = () => {
    const diff = availableTo.getTime() - availableFrom.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-3 p-3 bg-background/50 rounded-lg border border-border">
      {/* Daily Rate */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400">
          <DollarSign className="w-4 h-4" />
          <span className="text-sm">Daily Rate</span>
        </div>
        <span className="text-xl font-bold text-primary">
          ${rentPrice}/day
        </span>
      </div>

      {/* Availability Period */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Calendar className="w-4 h-4" />
          <span>Available Period</span>
        </div>
        <div className="pl-6 space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">From:</span>
            <span className="text-foreground">{formatDate(availableFrom)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">To:</span>
            <span className="text-foreground">{formatDate(availableTo)}</span>
          </div>
          <div className="text-xs text-gray-500 text-right">
            ({getDaysAvailable()} days available)
          </div>
        </div>
      </div>

      {/* Security Deposit */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Shield className="w-4 h-4" />
          <span>Security Deposit</span>
        </div>
        <span className="text-sm font-medium text-foreground">
          ${rentDeposit}
        </span>
      </div>

      {/* Rental Info */}
      <div className="text-xs text-gray-500 pt-2 border-t border-border">
        <p>• Deposit refunded after return inspection</p>
        <p>• Minimum rental period: 1 day</p>
      </div>
    </div>
  );
}
