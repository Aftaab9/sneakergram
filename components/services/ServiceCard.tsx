'use client';

import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Calendar, 
  Sparkles, 
  Wrench,
  ArrowRight 
} from 'lucide-react';
import { Service } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

/**
 * ServiceCard component displays a service offering
 * Shows icon, name, description, price, and turnaround time
 * 
 * @example
 * ```tsx
 * <ServiceCard 
 *   service={service} 
 *   onBook={() => handleBook(service.id)} 
 * />
 * ```
 */

interface ServiceCardProps {
  service: Service;
  onBook?: (serviceId: string) => void;
}

const iconMap = {
  'shield-check': ShieldCheck,
  'calendar': Calendar,
  'sparkles': Sparkles,
  'wrench': Wrench,
};

export function ServiceCard({ service, onBook }: ServiceCardProps) {
  const IconComponent = iconMap[service.icon as keyof typeof iconMap] || ShieldCheck;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 hover:border-primary/50 transition-colors">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-2">
              {service.name}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {service.description}
            </p>

            {/* Details */}
            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="text-lg font-bold text-primary">
                  ${service.price}
                </p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <p className="text-xs text-gray-500">Turnaround</p>
                <p className="text-sm text-white">
                  {service.turnaroundTime}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              variant="primary"
              onClick={() => onBook?.(service.id)}
              className="w-full group"
            >
              <span>Book Service</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
