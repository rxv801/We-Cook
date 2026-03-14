'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, LayoutDashboard, ShoppingBag, List, LogIn, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home, mobileOnly: true },
  { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { href: '/create', label: 'Share', icon: Plus, highlight: true },
  { href: '/my-listings', label: 'Listings', icon: List },
  { href: '/dashboard', label: 'Impact', icon: LayoutDashboard },
];

export function Header() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RG</span>
            </div>
            <span className="font-bold text-lg md:text-xl text-foreground">
              RescueGrid
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.filter(i => !i.mobileOnly).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className={cn(
                      'gap-2',
                      isActive && 'bg-secondary text-secondary-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/auth" className="hidden md:block">
              <Button variant="outline" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            if (item.highlight) {
              return (
                <Link key={item.href} href={item.href} className="flex-1 flex justify-center">
                  <div className="relative -mt-6">
                    <div className={cn(
                      "flex items-center justify-center h-14 w-14 rounded-full shadow-lg transition-all",
                      isActive 
                        ? "bg-primary text-primary-foreground scale-110" 
                        : "bg-primary/90 text-primary-foreground hover:bg-primary"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </Link>
              );
            }

            return (
              <Link 
                key={item.href} 
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
              >
                <div className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-lg transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for mobile bottom nav */}
      <div className="md:hidden h-16" />
    </>
  );
}
