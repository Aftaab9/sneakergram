'use client';

import { Event, EventType, EventStatus } from '@/types';
import { useEventStore } from '@/stores/eventStore';
import { useAuthStore } from '@/stores/authStore';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  ExternalLink,
  Bell,
  BellOff,
  Share2,
  Ticket,
  Store,
  Handshake,
  GraduationCap,
  Tag,
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

interface EventCardProps {
  event: Event;
}

const eventTypeIcons = {
  [EventType.RELEASE]: Ticket,
  [EventType.RAFFLE]: Tag,
  [EventType.MEETUP]: Handshake,
  [EventType.CONVENTION]: Store,
  [EventType.WORKSHOP]: GraduationCap,
  [EventType.SALE]: DollarSign,
};

const eventTypeColors = {
  [EventType.RELEASE]: 'text-red-500',
  [EventType.RAFFLE]: 'text-yellow-500',
  [EventType.MEETUP]: 'text-green-500',
  [EventType.CONVENTION]: 'text-purple-500',
  [EventType.WORKSHOP]: 'text-blue-500',
  [EventType.SALE]: 'text-pink-500',
};

const statusBadges = {
  [EventStatus.LIVE]: { text: 'LIVE NOW', color: 'bg-red-500' },
  [EventStatus.UPCOMING]: { text: 'UPCOMING', color: 'bg-primary' },
  [EventStatus.ENDED]: { text: 'ENDED', color: 'bg-gray-600' },
  [EventStatus.CANCELLED]: { text: 'CANCELLED', color: 'bg-gray-700' },
};

export function EventCard({ event }: EventCardProps) {
  const { rsvpEvent, unrsvpEvent } = useEventStore();
  const { user } = useAuthStore();
  const [showShareMenu, setShowShareMenu] = useState(false);

  const isAttending = user && event.attendees.includes(user.id);
  const isFull = event.maxAttendees && event.attendees.length >= event.maxAttendees;
  const TypeIcon = eventTypeIcons[event.type];
  const statusBadge = statusBadges[event.status];

  const handleRSVP = () => {
    if (isAttending) {
      unrsvpEvent(event.id);
    } else {
      rsvpEvent(event.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const formatEventDate = () => {
    const dateStr = format(event.date, 'MMM d, yyyy');
    const timeStr = format(event.date, 'h:mm a');
    
    if (event.endDate) {
      const endDateStr = format(event.endDate, 'MMM d, yyyy');
      return `${dateStr} - ${endDateStr}`;
    }
    
    return `${dateStr} at ${timeStr}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-gray-700 transition-colors">
      {/* Event Image */}
      <div className="relative aspect-[16/9] bg-gray-900">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          unoptimized
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`${statusBadge.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
            {statusBadge.text}
          </span>
        </div>

        {/* Event Type Badge */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-full p-2">
          <TypeIcon className={`w-5 h-5 ${eventTypeColors[event.type]}`} />
        </div>
      </div>

      {/* Event Details */}
      <div className="p-4 space-y-3">
        {/* Title and Organizer */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-gray-400">by {event.organizer}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 line-clamp-2">
          {event.description}
        </p>

        {/* Event Info Grid */}
        <div className="space-y-2 pt-2">
          {/* Date */}
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-300">{formatEventDate()}</span>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-300">{event.location}</p>
              {event.venue && (
                <p className="text-gray-500 text-xs">{event.venue}</p>
              )}
            </div>
          </div>

          {/* Attendees */}
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-300">
              {event.attendees.length} {event.maxAttendees && `/ ${event.maxAttendees}`} attending
            </span>
            {isFull && (
              <span className="text-xs text-red-500 font-medium">SOLD OUT</span>
            )}
          </div>

          {/* Price */}
          {event.price !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-300">
                {event.price === 0 ? 'Free' : `$${event.price}`}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {event.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3">
          {/* RSVP Button */}
          {event.status !== EventStatus.ENDED && event.status !== EventStatus.CANCELLED && (
            <button
              onClick={handleRSVP}
              disabled={!isAttending && !!isFull}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${
                isAttending
                  ? 'bg-gray-800 text-foreground hover:bg-gray-700'
                  : isFull
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-blue-600'
              }`}
            >
              {isAttending ? (
                <>
                  <BellOff className="w-4 h-4" />
                  <span>Cancel RSVP</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>{isFull ? 'Sold Out' : 'RSVP'}</span>
                </>
              )}
            </button>
          )}

          {/* Registration Link */}
          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 text-foreground rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Register</span>
            </a>
          )}

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center justify-center px-4 py-2.5 bg-gray-800 text-foreground rounded-lg hover:bg-gray-700 transition-colors"
            aria-label="Share event"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
