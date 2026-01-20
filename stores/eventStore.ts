import { create } from 'zustand';
import { Event, EventState, EventType, EventStatus } from '@/types';
import { mockEvents } from '@/lib/mockData';

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  filters: {},
  loading: false,
  error: null,

  loadEvents: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      set({ events: mockEvents, loading: false });
    } catch (error) {
      set({ error: 'Failed to load events', loading: false });
    }
  },

  rsvpEvent: (eventId: string) => {
    const currentUserId = 'user-1'; // Get from auth store
    set(state => ({
      events: state.events.map(event =>
        event.id === eventId
          ? { ...event, attendees: [...event.attendees, currentUserId] }
          : event
      ),
    }));
  },

  unrsvpEvent: (eventId: string) => {
    const currentUserId = 'user-1'; // Get from auth store
    set(state => ({
      events: state.events.map(event =>
        event.id === eventId
          ? { ...event, attendees: event.attendees.filter(id => id !== currentUserId) }
          : event
      ),
    }));
  },
}));
