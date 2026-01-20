'use client';

import { useEffect, useState } from 'react';
import { useEventStore } from '@/stores/eventStore';
import { EventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EventType, EventStatus } from '@/types';
import { Calendar } from 'lucide-react';

/**
 * Events Page - Instagram-style events feed
 * Shows sneaker releases, raffles, meetups, conventions, and workshops
 */
export default function EventsPage() {
  const { events, loading, loadEvents } = useEventStore();
  const [activeFilter, setActiveFilter] = useState<EventType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents = events.filter(event => {
    const matchesType = activeFilter === 'all' || event.type === activeFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesType && matchesStatus;
  });

  // Sort events: LIVE first, then UPCOMING by date, then ENDED
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (a.status === EventStatus.LIVE && b.status !== EventStatus.LIVE) return -1;
    if (a.status !== EventStatus.LIVE && b.status === EventStatus.LIVE) return 1;
    if (a.status === EventStatus.UPCOMING && b.status === EventStatus.UPCOMING) {
      return a.date.getTime() - b.date.getTime();
    }
    return b.date.getTime() - a.date.getTime();
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-border">
        <div className="max-w-[935px] mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">Events</h1>
          </div>
        </div>
      </div>

      {/* Filters */}
      <EventFilters
        activeFilter={activeFilter}
        statusFilter={statusFilter}
        onFilterChange={setActiveFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Events Grid */}
      <div className="max-w-[935px] mx-auto px-4 py-6">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No events found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
