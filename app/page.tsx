'use client';

import Link from 'next/link';
import { ArrowRight, Leaf, Users, DollarSign, Recycle, TrendingUp, MapPin, Zap, Globe, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { mockImpactStats, campusHubs } from '@/lib/mock-data';
import { useEffect, useState, useRef } from 'react';

function LiveCounter({ end, duration = 2500, prefix = '', suffix = '', incrementPerSecond = 0 }: { 
  end: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string;
  incrementPerSecond?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasAnimated]);

  useEffect(() => {
    if (!hasAnimated || incrementPerSecond === 0) return;

    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000 / incrementPerSecond);

    return () => clearInterval(interval);
  }, [hasAnimated, incrementPerSecond]);

  return (
    <div ref={ref}>
      <span className="tabular-nums">{prefix}{count.toLocaleString()}{suffix}</span>
    </div>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Dramatic gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.75_0.18_145_/_0.3),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_100%_50%,oklch(0.85_0.2_85_/_0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,oklch(0.75_0.18_145_/_0.1),transparent_50%)]" />
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.98_0_0_/_0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.98_0_0_/_0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container relative px-6 py-24 md:py-32 lg:py-40">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-10 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </div>
              <span className="text-sm font-medium text-primary tracking-wide">Now Live at 12 University Campuses</span>
            </div>
            
            {/* Headline */}
            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="block text-balance leading-[1.1]">
                We&apos;re Ending Campus
              </span>
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent leading-[1.1]">
                Food Waste Forever.
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className={`text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 text-pretty leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              RescueGrid connects students with surplus food before it hits the landfill. 
              <span className="text-foreground font-medium"> Save money. Reduce emissions. Build community.</span>
            </p>
            
            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Link href="/marketplace">
                <Button size="lg" className="gap-2 text-base px-8 h-14 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                  Start Rescuing Food
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 h-14 rounded-xl border-border/50 hover:bg-secondary/50 transition-all hover:-translate-y-0.5">
                  <Globe className="h-5 w-5" />
                  View Impact Data
                </Button>
              </Link>
            </div>
            
            {/* Social proof */}
            <div className={`flex flex-wrap items-center justify-center gap-8 text-muted-foreground transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 border-2 border-background" />
                  ))}
                </div>
                <span className="text-sm font-medium">2,400+ active users</span>
              </div>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-accent" />
                <span className="font-medium">Backed by climate VCs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Stats Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/80 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.75_0.18_145_/_0.05),transparent_70%)]" />
        
        <div className="container relative px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </div>
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">Live Platform Metrics</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Impact That Compounds
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Every transaction creates measurable environmental and social impact. 
              These numbers update in real-time.
            </p>
          </div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            <StatCard
              icon={<Recycle className="h-6 w-6" />}
              value={mockImpactStats.foodRescued}
              label="Kilograms Rescued"
              sublabel="Food saved from landfill"
              incrementPerSecond={0.3}
              gradient="from-primary/20 to-primary/5"
              iconColor="text-primary"
            />
            <StatCard
              icon={<Leaf className="h-6 w-6" />}
              value={mockImpactStats.co2Avoided}
              label="kg CO2 Avoided"
              sublabel="Emissions prevented"
              incrementPerSecond={0.5}
              gradient="from-primary/15 to-accent/5"
              iconColor="text-primary"
            />
            <StatCard
              icon={<DollarSign className="h-6 w-6" />}
              value={mockImpactStats.moneySaved}
              label="Dollars Saved"
              sublabel="Student savings"
              prefix="$"
              incrementPerSecond={0.8}
              gradient="from-accent/20 to-accent/5"
              iconColor="text-accent"
            />
            <StatCard
              icon={<Users className="h-6 w-6" />}
              value={mockImpactStats.mealsShared}
              label="Meals Shared"
              sublabel="Community connections"
              incrementPerSecond={0.2}
              gradient="from-primary/10 to-transparent"
              iconColor="text-primary"
            />
          </div>

          {/* Bottom row of secondary stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 pt-12 border-t border-border/50">
            <SecondaryStatCard value={mockImpactStats.studentsFed} label="Students Fed" />
            <SecondaryStatCard value={mockImpactStats.activeHubs} label="Campus Hubs" />
            <SecondaryStatCard value={12} label="Universities" />
            <SecondaryStatCard value={98} label="% Satisfaction" suffix="%" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.85_0.2_85_/_0.08),transparent_50%)]" />
        
        <div className="container relative px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Three Steps to Zero Waste
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students building a more sustainable campus food system
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <StepCard
              number="01"
              title="List Surplus Food"
              description="Posting takes 30 seconds. Share homemade meals, groceries, or rescued items with instant visibility."
              icon={<Clock className="h-5 w-5" />}
            />
            <StepCard
              number="02"
              title="Match & Connect"
              description="Our algorithm matches food with nearby students. Real-time notifications ensure nothing expires."
              icon={<Zap className="h-5 w-5" />}
            />
            <StepCard
              number="03"
              title="Pick Up & Impact"
              description="Meet at designated campus hubs. Track your personal impact on our dashboard."
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* Campus Hubs */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
        
        <div className="container relative px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Campus Pickup Network
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Safe, convenient exchange points designed for busy student schedules
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {campusHubs.map((hub, i) => (
              <div
                key={hub}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-secondary/80 text-secondary-foreground border border-border/50 hover:border-primary/50 hover:bg-secondary transition-all cursor-default"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{hub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zero Waste Rescue CTA */}
      <section className="py-24 md:py-32">
        <div className="container px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rescue/30 via-rescue/15 to-background border border-rescue/40 p-10 md:p-16">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rescue/20 rounded-full blur-[150px] animate-pulse" />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
            
            <div className="relative max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rescue/20 border border-rescue/30 text-rescue-foreground mb-6">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rescue opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rescue" />
                </div>
                <span className="text-sm font-semibold uppercase tracking-wider">Rescue Mode Active</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance leading-tight">
                Food Has a Deadline.<br />
                <span className="text-rescue">Be the Hero.</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 text-pretty max-w-2xl leading-relaxed">
                Rescue items are expiring soon. Get deep discounts or free food while 
                saving perfectly good meals from the landfill. Our countdown system ensures 
                nothing goes to waste.
              </p>
              
              <Link href="/marketplace?filter=rescue">
                <Button size="lg" className="bg-rescue hover:bg-rescue/90 text-rescue-foreground gap-2 h-14 px-8 rounded-xl shadow-lg shadow-rescue/25 transition-all hover:shadow-xl hover:shadow-rescue/30 hover:-translate-y-0.5">
                  View Rescue Items
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-16">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold">RG</span>
              </div>
              <div>
                <span className="font-bold text-xl text-foreground block">RescueGrid</span>
                <span className="text-xs text-muted-foreground">Campus Food Resilience</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Building the infrastructure for zero-waste campuses. 
              One meal at a time.
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
                Marketplace
              </Link>
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Impact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  sublabel,
  prefix = '',
  incrementPerSecond = 0,
  gradient,
  iconColor,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  sublabel: string;
  prefix?: string;
  incrementPerSecond?: number;
  gradient: string;
  iconColor: string;
}) {
  return (
    <div className={`relative p-6 md:p-8 rounded-2xl bg-gradient-to-br ${gradient} border border-border/50 overflow-hidden group hover:border-primary/30 transition-all`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-background/50 ${iconColor} mb-4`}>
        {icon}
      </div>
      
      <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-1">
        <LiveCounter end={value} prefix={prefix} incrementPerSecond={incrementPerSecond} />
      </div>
      
      <div className="text-sm font-semibold text-foreground mb-0.5">{label}</div>
      <div className="text-xs text-muted-foreground">{sublabel}</div>
    </div>
  );
}

function SecondaryStatCard({
  value,
  label,
  suffix = '',
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
        <LiveCounter end={value} suffix={suffix} />
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative p-8 rounded-2xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card transition-all group">
      <div className="absolute -top-4 left-8">
        <div className="flex items-center justify-center h-8 w-16 rounded-full bg-primary text-primary-foreground text-sm font-bold">
          {number}
        </div>
      </div>
      
      <div className="pt-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-primary">{icon}</span>
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
