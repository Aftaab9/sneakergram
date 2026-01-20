import { create } from 'zustand';
import { Service } from '@/types';
import { mockServices } from '@/lib/mockData';

/**
 * Service booking state
 */
export type ServiceBooking = {
  id: string;
  serviceId: string;
  userId: string;
  sneakerId?: string;
  scheduledDate?: Date;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
};

interface ServiceState {
  services: Service[];
  bookings: ServiceBooking[];
  loading: boolean;
  selectedService: Service | null;
  showBookingModal: boolean;
  bookingConfirmation: ServiceBooking | null;

  // Actions
  loadServices: () => Promise<void>;
  selectService: (service: Service | null) => void;
  bookService: (serviceId: string, details: Partial<ServiceBooking>) => Promise<ServiceBooking>;
  getBookingsByUser: (userId: string) => ServiceBooking[];
  setShowBookingModal: (show: boolean) => void;
  clearBookingConfirmation: () => void;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  bookings: [],
  loading: false,
  selectedService: null,
  showBookingModal: false,
  bookingConfirmation: null,

  loadServices: async () => {
    set({ loading: true });
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    set({ services: mockServices, loading: false });
  },

  selectService: (service) => {
    set({ selectedService: service, showBookingModal: !!service });
  },

  bookService: async (serviceId, details) => {
    const service = get().services.find(s => s.id === serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    // Create booking
    const booking: ServiceBooking = {
      id: `booking-${Date.now()}`,
      serviceId,
      userId: details.userId || 'current-user',
      sneakerId: details.sneakerId,
      scheduledDate: details.scheduledDate,
      notes: details.notes,
      status: 'confirmed',
      createdAt: new Date(),
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    set(state => ({
      bookings: [...state.bookings, booking],
      bookingConfirmation: booking,
      showBookingModal: false,
    }));

    return booking;
  },

  getBookingsByUser: (userId) => {
    return get().bookings.filter(b => b.userId === userId);
  },

  setShowBookingModal: (show) => {
    set({ showBookingModal: show });
    if (!show) {
      set({ selectedService: null });
    }
  },

  clearBookingConfirmation: () => {
    set({ bookingConfirmation: null });
  },
}));
