'use client';

import { useState } from 'react';
import { X, Calendar, FileText } from 'lucide-react';
import { Service } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useServiceStore } from '@/stores/serviceStore';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

/**
 * BookingModal component for booking services
 * Allows users to schedule and provide details for service bookings
 */

interface BookingModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ service, isOpen, onClose }: BookingModalProps) {
  const [scheduledDate, setScheduledDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const { bookService } = useServiceStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service || !user) return;

    setLoading(true);
    try {
      await bookService(service.id, {
        userId: user.id,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
        notes,
      });

      toast.success('Service booked successfully!');
      onClose();
      
      // Reset form
      setScheduledDate('');
      setNotes('');
    } catch (error) {
      toast.error('Failed to book service');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Book Service
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Service Info */}
        <div className="bg-background/50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            {service.name}
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-primary font-bold">
              ${service.price}
            </span>
            <span className="text-gray-400">
              {service.turnaroundTime}
            </span>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Scheduled Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Preferred Date (Optional)
            </label>
            <Input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions or details..."
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
