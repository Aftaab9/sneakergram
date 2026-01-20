'use client';

import { EventType, EventStatus } from '@/types';
import { Ticket, Tag, Handshake, Store, GraduationCap, DollarSign } from 'lucide-react';

interface EventFiltersProps {
  activeFilter: EventType | 'all';
  statusFilter: EventStatus | 'all';
  onFilterChange: (filter: EventType | 'all') => void;
  onStatusChange: (status: EventStatus | 'all') => void;
}

const filterOptions = [
  { value: 'all' as const, label: 'All Events', icon: null },
  { value: EventType.RELEASE, label: 'Releases', icon: Ticket },
  { value: EventType.RAFFLE, label: 'Raffles', icon: Tag },
  { value: EventType.MEETUP, label: 'Meetups', icon: Handshake },
  { value: EventType.CONVENTION, label: 'Conventions', icon: Store },
  { value: EventType.WORKSHOP, label: 'Workshops', icon: GraduationCap },
  { value: EventType.SALE, label: 'Sales', icon: DollarSign },
];

const statusOptions = [
  { value: 'all' as const, label: 'All' },
  { value: EventStatus.LIVE, label: 'Live' },
  { value: EventStatus.UPCOMING, label: 'Upcoming' },
];

export function EventFilters({
  activeFilter,
  statusFilter,
  onFilterChange,
  onStatusChange,
}: EventFiltersProps) {
  return (
    <div className="sticky top-[57px] z-30 bg-black border-b border-border">
      <div className="max-w-[935px] mx-auto px-4">
        {/* Type Filters */}
        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          {filterOptions.map(option => {
            const Icon = option.icon;
            const isActive = activeFilter === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => onFilterChange(option.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 pb-3">
          {statusOptions.map(option => {
            const isActive = statusFilter === option.value;
            
            return (
              <button
                key={option.value}
                onClick={() => onStatusChange(option.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
