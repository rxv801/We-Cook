'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, MapPin, AlertTriangle, Flame, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type Listing, getTimeRemaining, isUrgent } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface ListingCardProps {
  listing: Listing;
  variant?: 'default' | 'rescue';
}

function getSecondsRemaining(expiresAt: Date): number {
  return Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
}

function formatCountdown(seconds: number): { hours: string; minutes: string; secs: string } {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    secs: secs.toString().padStart(2, '0'),
  };
}

export function ListingCard({ listing, variant = 'default' }: ListingCardProps) {
  const [secondsLeft, setSecondsLeft] = useState(getSecondsRemaining(listing.expiresAt));
  const urgent = isUrgent(listing.expiresAt);
  const isRescueCard = listing.isRescue || variant === 'rescue';
  const isCritical = secondsLeft <= 3600;
  const countdown = formatCountdown(secondsLeft);

  useEffect(() => {
    if (!isRescueCard) return;
    const interval = setInterval(() => {
      setSecondsLeft(getSecondsRemaining(listing.expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [listing.expiresAt, isRescueCard]);

  return (
    <Link href={`/marketplace?listing=${listing.id}`} className="block touch-manipulation">
      <Card
        className={cn(
          'group relative overflow-hidden transition-all duration-300 active:scale-[0.98] cursor-pointer h-full',
          isRescueCard && isCritical && 'ring-2 ring-rescue shadow-[0_0_30px_rgba(239,68,68,0.4)]',
          isRescueCard && urgent && !isCritical && 'ring-2 ring-orange-500/70 shadow-[0_0_20px_rgba(249,115,22,0.3)]',
          isRescueCard && !urgent && 'ring-1 ring-rescue/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
          !isRescueCard && 'hover:ring-1 hover:ring-primary/50 active:ring-1 active:ring-primary/50'
        )}
      >
        {/* Rescue glow overlay */}
        {isRescueCard && (
          <div 
            className={cn(
              'absolute inset-0 pointer-events-none z-10 opacity-0 transition-opacity duration-500',
              isCritical && 'opacity-100 animate-pulse bg-gradient-to-t from-rescue/20 via-transparent to-transparent',
              urgent && !isCritical && 'opacity-100 bg-gradient-to-t from-orange-500/15 via-transparent to-transparent'
            )}
          />
        )}

        {/* Image area - taller on mobile for easier tapping */}
        <div className="relative aspect-[4/3] sm:aspect-[4/3] overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-5xl sm:text-4xl text-muted-foreground/50">
              {listing.category === 'meal' && '🍽️'}
              {listing.category === 'groceries' && '🥬'}
              {listing.category === 'snacks' && '🍿'}
              {listing.category === 'drinks' && '🥤'}
              {listing.category === 'baked' && '🍪'}
            </span>
          </div>

          {/* Badges - larger touch targets on mobile */}
          <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1.5 z-20">
            {listing.isFree && (
              <Badge className="bg-primary text-primary-foreground font-bold shadow-lg text-xs px-2 py-0.5">
                FREE
              </Badge>
            )}
            {listing.isRescue && (
              <Badge 
                className={cn(
                  'font-bold shadow-lg flex items-center gap-1 text-xs px-2 py-0.5',
                  isCritical 
                    ? 'bg-rescue text-rescue-foreground animate-pulse' 
                    : 'bg-orange-500 text-white'
                )}
              >
                {isCritical ? <Flame className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                RESCUE
              </Badge>
            )}
          </div>

          {/* Countdown timer for rescue items */}
          {isRescueCard && (
            <div className="absolute bottom-0 left-0 right-0 z-20">
              <div 
                className={cn(
                  'flex items-center justify-center gap-1.5 py-2.5 px-3 backdrop-blur-md',
                  isCritical 
                    ? 'bg-rescue/90 text-white' 
                    : urgent 
                      ? 'bg-orange-500/90 text-white'
                      : 'bg-background/80 text-foreground'
                )}
              >
                <Clock className="h-4 w-4" />
                <div className="flex items-center gap-1 font-mono text-sm sm:text-xs font-bold tracking-wider">
                  <span className="bg-black/20 px-2 py-1 rounded">{countdown.hours}</span>
                  <span className="animate-pulse">:</span>
                  <span className="bg-black/20 px-2 py-1 rounded">{countdown.minutes}</span>
                  <span className="animate-pulse">:</span>
                  <span className="bg-black/20 px-2 py-1 rounded">{countdown.secs}</span>
                </div>
                {isCritical && <Zap className="h-4 w-4 animate-pulse" />}
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4 relative z-20">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-foreground line-clamp-2 text-base sm:text-sm leading-snug group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
            <span className={cn(
              'text-lg sm:text-base font-bold whitespace-nowrap',
              listing.isFree ? 'text-primary' : 'text-foreground'
            )}>
              {listing.isFree ? 'Free' : `$${listing.price}`}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm sm:text-xs text-muted-foreground mb-3">
            <Avatar className="h-6 w-6 sm:h-5 sm:w-5">
              <AvatarFallback className="text-xs sm:text-[10px] bg-secondary text-secondary-foreground">
                {listing.seller.avatar}
              </AvatarFallback>
            </Avatar>
            <span>{listing.seller.name}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-sm sm:text-xs text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 sm:h-3 sm:w-3 flex-shrink-0" />
            <span className="truncate">{listing.pickupHub}</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {listing.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs sm:text-[10px] px-2 py-0.5 sm:px-1.5 sm:py-0"
              >
                {tag}
              </Badge>
            ))}
            {listing.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs sm:text-[10px] px-2 py-0.5 sm:px-1.5 sm:py-0">
                +{listing.tags.length - 2}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
