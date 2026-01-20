'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Calendar, FileText } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ServiceBooking } from '@/stores/serviceStore';
import { useServiceStore } from '@/stores/serviceStore';
import { mockServices } from '@/lib/mockData';

/**
 * BookingConfirmation component displays booking confirmation details
 * Shows service details and next steps after successful booking
 */

interface BookingConfirmationProps {
  booking: ServiceBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingConfirmation({ booking, isOpen, onClose }: BookingConfirmationProps) {
  const { clearBookingConfirmation } = useServiceStore();

  const handleClose = () => {
    clearBookingConfirmation();
    onClose();
  };

  if (!booking) return null;

  const service = mockServices.find(s => s.id === booking.serviceId);
  if (!service) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </motion.div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-400">
            Your service has been successfully booked
          </p>
        </div>

        {/* Service Details */}
        <div className="bg-background/50 rounded-lg p-4 mb-6 space-y-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">Service</p>
            <p className="text-white font-semibold">{service.name}</p>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Price</p>
              <p className="text-primary font-bold">${service.price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Turnaround</p>
              <p className="text-white">{service.turnaroundTime}</p>
            </div>
          </div>

          {booking.scheduledDate && (
            <>
              <div className="h-px bg-border" />
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Scheduled Date
                </p>
                <p className="text-white">
                  {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </>
          )}

          {booking.notes && (
            <>
              <div className="h-px bg-border" />
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  <FileText className="w-3 h-3 inline mr-1" />
                  Notes
                </p>
                <p className="text-white text-sm">{booking.notes}</p>
              </div>
            </>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-primary mb-2">
            Next Steps
          </h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Check your email for booking confirmation</li>
            <li>• We&apos;ll contact you to arrange details</li>
            <li>• Track your booking in your profile</li>
          </ul>
        </div>

        {/* Close Button */}
        <Button
          variant="primary"
          onClick={handleClose}
          className="w-full"
        >
          Done
        </Button>
      </div>
    </Modal>
  );
}
