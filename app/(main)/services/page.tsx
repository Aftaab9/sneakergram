'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ServiceCard } from '@/components/services/ServiceCard';
import { BookingModal } from '@/components/services/BookingModal';
import { BookingConfirmation } from '@/components/services/BookingConfirmation';
import { useServiceStore } from '@/stores/serviceStore';
import { useAuthStore } from '@/stores/authStore';
import { ServiceCategory } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * Services Page - Authentication, rental, cleaning, restoration services
 * Displays available services with booking options
 * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
 */
export default function ServicesPage() {
  const { 
    services, 
    loading, 
    selectedService,
    showBookingModal,
    bookingConfirmation,
    loadServices, 
    selectService,
    setShowBookingModal,
  } = useServiceStore();
  
  const { isAuthenticated } = useAuthStore();
  const [filter, setFilter] = useState<ServiceCategory | 'all'>('all');

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleBookService = (serviceId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to book services');
      return;
    }

    const service = services.find(s => s.id === serviceId);
    if (service) {
      selectService(service);
    }
  };

  const filteredServices = filter === 'all' 
    ? services 
    : services.filter(s => s.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Services
          </h1>
          <p className="text-gray-400">
            Professional services for your sneaker collection
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {[
            { value: 'all', label: 'All Services' },
            { value: ServiceCategory.AUTHENTICATION, label: 'Authentication' },
            { value: ServiceCategory.RENTAL, label: 'Rental' },
            { value: ServiceCategory.CLEANING, label: 'Cleaning' },
            { value: ServiceCategory.RESTORATION, label: 'Restoration' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as ServiceCategory | 'all')}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${filter === tab.value
                  ? 'bg-primary text-white'
                  : 'bg-card text-gray-400 hover:text-white'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400">
                No services found in this category
              </p>
            </motion.div>
          ) : (
            filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ServiceCard
                  service={service}
                  onBook={handleBookService}
                />
              </motion.div>
            ))
          )}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-card border border-border rounded-lg p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-3">
            Why Choose Our Services?
          </h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Professional experts with years of experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Fast turnaround times and reliable service</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Secure handling and insurance coverage</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">✓</span>
              <span>Satisfaction guaranteed or your money back</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        service={selectedService}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />

      {/* Booking Confirmation */}
      <BookingConfirmation
        booking={bookingConfirmation}
        isOpen={!!bookingConfirmation}
        onClose={() => {}}
      />
    </div>
  );
}
