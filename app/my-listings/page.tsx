'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Clock, MapPin, Check, X, Package, Users } from 'lucide-react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  myListings,
  mockRequests,
  getTimeRemaining,
  formatTimeAgo,
  type Listing,
  type Request,
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function MyListingsPage() {
  const [listings, setListings] = useState(myListings);
  const [requests, setRequests] = useState(mockRequests);

  const activeListings = listings.filter((l) => l.quantity > 0);
  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const acceptedRequests = requests.filter((r) => r.status === 'accepted');

  const handleAcceptRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'accepted' as const } : r
      )
    );
  };

  const handleDeclineRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'declined' as const } : r
      )
    );
  };

  const handleMarkCompleted = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'completed' as const } : r
      )
    );
  };

  const getListingForRequest = (listingId: string) => {
    return listings.find((l) => l.id === listingId);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="container px-4 py-6 md:py-8">
        {/* Page Header */}
        <div className="flex items-start justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-1 md:mb-2">
              My Listings
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Manage listings and requests
            </p>
          </div>
          <Link href="/create">
            <Button className="gap-2 h-10 md:h-9 px-3 md:px-4">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Listing</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>

        {/* Stats Cards - Horizontal scroll on mobile */}
        <div className="-mx-4 px-4 md:mx-0 md:px-0 mb-6 md:mb-8">
          <div className="flex gap-3 md:grid md:grid-cols-4 overflow-x-auto pb-2 md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-hide">
            <StatsCard
              icon={<Package className="h-5 w-5" />}
              value={activeListings.length}
              label="Active"
            />
            <StatsCard
              icon={<Users className="h-5 w-5" />}
              value={pendingRequests.length}
              label="Pending"
              highlight={pendingRequests.length > 0}
            />
            <StatsCard
              icon={<Clock className="h-5 w-5" />}
              value={acceptedRequests.length}
              label="Awaiting"
            />
            <StatsCard
              icon={<Check className="h-5 w-5" />}
              value={requests.filter((r) => r.status === 'completed').length}
              label="Completed"
            />
          </div>
        </div>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6 h-12 md:h-10">
            <TabsTrigger value="listings" className="gap-2 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Package className="h-4 w-4" />
              <span>Listings</span>
              {activeListings.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {activeListings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="requests" className="gap-2 text-sm md:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4" />
              <span>Requests</span>
              {pendingRequests.length > 0 && (
                <Badge className="ml-1 bg-accent text-accent-foreground h-5 px-1.5 text-[10px]">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="mt-0">
            {activeListings.length === 0 ? (
              <EmptyState
                title="No active listings"
                description="Share your extra food with the campus community"
                actionLabel="Create Listing"
                actionHref="/create"
              />
            ) : (
              <div className="flex flex-col gap-3 md:gap-4">
                {activeListings.map((listing) => (
                  <ListingRow
                    key={listing.id}
                    listing={listing}
                    requestCount={
                      requests.filter(
                        (r) =>
                          r.listingId === listing.id && r.status === 'pending'
                      ).length
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="mt-0">
            {requests.length === 0 ? (
              <EmptyState
                title="No requests yet"
                description="When someone requests your food, it will appear here"
              />
            ) : (
              <div className="flex flex-col gap-4">
                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Pending ({pendingRequests.length})
                    </h3>
                    {pendingRequests.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        listing={getListingForRequest(request.listingId)}
                        onAccept={() => handleAcceptRequest(request.id)}
                        onDecline={() => handleDeclineRequest(request.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Accepted Requests */}
                {acceptedRequests.length > 0 && (
                  <div className="flex flex-col gap-3 mt-2">
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Awaiting Pickup ({acceptedRequests.length})
                    </h3>
                    {acceptedRequests.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        listing={getListingForRequest(request.listingId)}
                        onMarkCompleted={() => handleMarkCompleted(request.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatsCard({
  icon,
  value,
  label,
  highlight,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <Card className={cn(
      "min-w-[110px] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink",
      highlight && "ring-1 ring-accent bg-accent/5"
    )}>
      <CardContent className="p-3 md:p-4 flex items-center gap-3">
        <div className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center",
          highlight ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
        )}>
          {icon}
        </div>
        <div>
          <div className="text-xl md:text-2xl font-bold text-foreground">{value}</div>
          <div className="text-[10px] md:text-xs text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ListingRow({
  listing,
  requestCount,
}: {
  listing: Listing;
  requestCount: number;
}) {
  return (
    <Card className="overflow-hidden touch-manipulation active:bg-muted/50 transition-colors">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start gap-3 md:gap-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-2xl md:text-3xl">
              {listing.category === 'meal' && '🍽️'}
              {listing.category === 'groceries' && '🥬'}
              {listing.category === 'snacks' && '🍿'}
              {listing.category === 'drinks' && '🥤'}
              {listing.category === 'baked' && '🍪'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-1">
                {listing.title}
              </h3>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {listing.isFree && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5">
                    FREE
                  </Badge>
                )}
                {listing.isRescue && (
                  <Badge className="bg-rescue text-rescue-foreground text-[10px] px-1.5">
                    RESCUE
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-[100px] md:max-w-none">{listing.pickupHub}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{getTimeRemaining(listing.expiresAt)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs md:text-sm text-muted-foreground">
                {listing.quantity} left
                {!listing.isFree && (
                  <span className="ml-2 text-foreground font-medium">
                    ${listing.price}
                  </span>
                )}
              </div>
              {requestCount > 0 && (
                <Badge variant="secondary" className="bg-accent text-accent-foreground text-[10px] md:text-xs">
                  {requestCount} request{requestCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RequestCard({
  request,
  listing,
  onAccept,
  onDecline,
  onMarkCompleted,
}: {
  request: Request;
  listing?: Listing;
  onAccept?: () => void;
  onDecline?: () => void;
  onMarkCompleted?: () => void;
}) {
  const isPending = request.status === 'pending';
  const isAccepted = request.status === 'accepted';

  return (
    <Card
      className={cn(
        'overflow-hidden',
        isPending && 'border-primary/30 bg-primary/5'
      )}
    >
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start gap-3 md:gap-4">
          <Avatar className="h-10 w-10 md:h-12 md:w-12 flex-shrink-0">
            <AvatarFallback className="bg-secondary text-secondary-foreground text-sm md:text-base">
              {request.buyerAvatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-foreground text-sm md:text-base">
                {request.buyerName}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground">
                wants {request.quantity}x
              </span>
            </div>
            {listing && (
              <p className="text-xs md:text-sm text-muted-foreground mb-3 truncate">
                {listing.title}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {isPending && (
                <>
                  <Button 
                    size="sm" 
                    onClick={onAccept} 
                    className="gap-1.5 h-9 md:h-8 px-4 md:px-3 text-sm md:text-xs touch-manipulation"
                  >
                    <Check className="h-4 w-4 md:h-3 md:w-3" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onDecline}
                    className="gap-1.5 h-9 md:h-8 px-4 md:px-3 text-sm md:text-xs touch-manipulation"
                  >
                    <X className="h-4 w-4 md:h-3 md:w-3" />
                    Decline
                  </Button>
                </>
              )}
              {isAccepted && (
                <Button 
                  size="sm" 
                  onClick={onMarkCompleted} 
                  className="gap-1.5 h-9 md:h-8 px-4 md:px-3 text-sm md:text-xs touch-manipulation"
                >
                  <Check className="h-4 w-4 md:h-3 md:w-3" />
                  Mark Completed
                </Button>
              )}
            </div>
          </div>
          <div className="text-[10px] md:text-xs text-muted-foreground flex-shrink-0">
            {formatTimeAgo(request.createdAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="text-center py-12 md:py-16 px-4">
      <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-muted mb-4">
        <Package className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground" />
      </div>
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto mb-4">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="h-10 md:h-9 px-6">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
