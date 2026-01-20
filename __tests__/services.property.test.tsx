import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { ServiceCard } from '@/components/services/ServiceCard';
import { BookingConfirmation } from '@/components/services/BookingConfirmation';
import { Service, ServiceCategory } from '@/types';
import { mockServices } from '@/lib/mockData';

/**
 * Property-based tests for Services functionality
 * Tests universal properties that should hold across all service data
 */

// Clean up after each test to avoid DOM pollution
afterEach(() => {
  cleanup();
});

describe('Services Property Tests', () => {
  /**
   * Feature: sneakergram-app, Property 43: Service cards display all fields
   * Validates: Requirements 16.4
   * 
   * For any service, the ServiceCard should display:
   * - Icon
   * - Name
   * - Description
   * - Price
   * - Turnaround time
   * - Call-to-action button
   */
  it('Property 43: Service cards display all required fields', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }),
          name: fc.constantFrom('Authentication Service', 'Rental Service', 'Cleaning Service', 'Restoration Service'),
          description: fc.constantFrom(
            'Professional sneaker authentication',
            'Rent sneakers for special occasions',
            'Deep cleaning and care services',
            'Expert restoration and repair'
          ),
          icon: fc.constantFrom('shield-check', 'calendar', 'sparkles', 'wrench'),
          price: fc.integer({ min: 10, max: 200 }),
          turnaroundTime: fc.constantFrom('1-2 days', '3-5 days', '1 week', '2 weeks'),
          category: fc.constantFrom(
            ServiceCategory.AUTHENTICATION,
            ServiceCategory.RENTAL,
            ServiceCategory.CLEANING,
            ServiceCategory.RESTORATION
          ),
        }),
        (service: Service) => {
          // Clean up before each property test iteration
          cleanup();
          
          const { container } = render(
            <ServiceCard service={service} />
          );

          // Check that name is displayed (using heading role for specificity)
          const nameElement = screen.getByRole('heading');
          expect(nameElement).toBeInTheDocument();
          expect(nameElement.textContent).toContain(service.name.trim());

          // Check that description is displayed
          // The description should be visible in the document
          expect(container.textContent).toContain(service.description.trim());

          // Check that price is displayed
          const priceElement = screen.getByText(`$${service.price}`);
          expect(priceElement).toBeInTheDocument();

          // Check that turnaround time is displayed
          expect(container.textContent).toContain(service.turnaroundTime.trim());

          // Check that CTA button is present
          const buttonElement = screen.getByRole('button', { name: /Book Service/i });
          expect(buttonElement).toBeInTheDocument();

          // Check that icon container exists (we can't easily test the specific icon)
          const iconContainer = container.querySelector('.bg-primary\\/10');
          expect(iconContainer).toBeInTheDocument();
          
          // Clean up after this iteration
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Service Booking Property Tests', () => {
  /**
   * Feature: sneakergram-app, Property 44: Service bookings show confirmation
   * Validates: Requirements 16.5
   * 
   * For any service booking, the confirmation should display:
   * - Service details
   * - Next steps
   * - Booking information
   */
  it('Property 44: Service bookings display confirmation with all details', () => {
    fc.assert(
      fc.property(
        fc.record({
          // Booking data
          booking: fc.record({
            id: fc.string({ minLength: 1 }),
            serviceId: fc.constantFrom(...mockServices.map(s => s.id)),
            userId: fc.string({ minLength: 1 }),
            scheduledDate: fc.option(fc.date(), { nil: undefined }),
            notes: fc.option(fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length >= 5), { nil: undefined }),
            status: fc.constantFrom('pending', 'confirmed', 'completed', 'cancelled') as fc.Arbitrary<'pending' | 'confirmed' | 'completed' | 'cancelled'>,
            createdAt: fc.date(),
          }),
        }),
        ({ booking }) => {
          // Clean up before each property test iteration
          cleanup();
          
          // Get the service from mockServices
          const service = mockServices.find(s => s.id === booking.serviceId);
          if (!service) return; // Skip if service not found

          const { container } = render(
            <BookingConfirmation
              booking={booking}
              isOpen={true}
              onClose={() => {}}
            />
          );

          // Check that confirmation header is present
          const headerElement = screen.getByText('Booking Confirmed!');
          expect(headerElement).toBeInTheDocument();

          // Check that service name is displayed
          const serviceNameElement = screen.getByText(service.name);
          expect(serviceNameElement).toBeInTheDocument();

          // Check that price is displayed
          const priceElement = screen.getByText(`$${service.price}`);
          expect(priceElement).toBeInTheDocument();

          // Check that turnaround time is displayed
          const turnaroundElement = screen.getByText(service.turnaroundTime);
          expect(turnaroundElement).toBeInTheDocument();

          // Check that next steps section is present
          const nextStepsElement = screen.getByText('Next Steps');
          expect(nextStepsElement).toBeInTheDocument();

          // Check that done button is present
          const doneButtonElement = screen.getByText('Done');
          expect(doneButtonElement).toBeInTheDocument();

          // If scheduled date exists, check it's displayed
          if (booking.scheduledDate) {
            const scheduledDateElement = screen.getByText('Scheduled Date');
            expect(scheduledDateElement).toBeInTheDocument();
          }

          // If notes exist, check they're displayed
          if (booking.notes) {
            const notesLabelElement = screen.getByText('Notes');
            expect(notesLabelElement).toBeInTheDocument();
            const notesTextElement = screen.getByText((content, element) => {
              return element?.textContent === booking.notes;
            });
            expect(notesTextElement).toBeInTheDocument();
          }
          
          // Clean up after this iteration
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
