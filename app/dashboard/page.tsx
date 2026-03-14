'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Recycle,
  Leaf,
  MapPin,
  TrendingUp,
  Award,
  Target,
  Utensils,
} from 'lucide-react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  mockImpactStats,
  leaderboard,
  achievements,
  currentUserStats,
  weeklyGoal,
  hubActivity,
} from '@/lib/mock-data';

function AnimatedNumber({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function DashboardPage() {
  const progressPercent = Math.round((weeklyGoal.current / weeklyGoal.target) * 100);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />

      <main className="container px-4 py-6 md:py-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-1 md:mb-2">
            Impact Dashboard
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Track your contribution to campus food resilience
          </p>
        </div>

        {/* Hero Stats - Horizontal scroll on mobile */}
        <div className="mb-6 md:mb-8 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-3 md:grid md:grid-cols-3 lg:grid-cols-6 overflow-x-auto pb-2 md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-hide">
            <ImpactStatCard
              icon={<Utensils className="h-5 w-5" />}
              value={mockImpactStats.mealsShared}
              label="Meals Shared"
              trend="+12%"
            />
            <ImpactStatCard
              icon={<Users className="h-5 w-5" />}
              value={mockImpactStats.studentsFed}
              label="Students Fed"
              trend="+8%"
            />
            <ImpactStatCard
              icon={<DollarSign className="h-5 w-5" />}
              value={mockImpactStats.moneySaved}
              label="Money Saved"
              prefix="$"
              trend="+15%"
            />
            <ImpactStatCard
              icon={<Recycle className="h-5 w-5" />}
              value={mockImpactStats.foodRescued}
              label="Kg Rescued"
              suffix=" kg"
              trend="+22%"
            />
            <ImpactStatCard
              icon={<Leaf className="h-5 w-5" />}
              value={mockImpactStats.co2Avoided}
              label="CO2 Avoided"
              suffix=" kg"
              trend="+18%"
            />
            <ImpactStatCard
              icon={<MapPin className="h-5 w-5" />}
              value={mockImpactStats.activeHubs}
              label="Active Hubs"
            />
          </div>
        </div>

        {/* Your Stats - Mobile first card */}
        <Card className="mb-6 md:hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-primary/5">
                <div className="text-2xl font-bold text-foreground">{currentUserStats.mealsShared}</div>
                <div className="text-[10px] text-muted-foreground">Meals</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-primary/5">
                <div className="text-2xl font-bold text-foreground">${currentUserStats.moneySaved}</div>
                <div className="text-[10px] text-muted-foreground">Saved</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-primary/5">
                <div className="text-2xl font-bold text-foreground">{currentUserStats.itemsRescued}</div>
                <div className="text-[10px] text-muted-foreground">Rescued</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Weekly Goal */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3 md:pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Target className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    Weekly Campus Goal
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm mt-1">
                    Help reach {weeklyGoal.target} meals this week
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-base md:text-lg px-2 md:px-3 py-0.5 md:py-1">
                  {progressPercent}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col gap-4">
                <Progress value={progressPercent} className="h-3 md:h-4" />
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">
                    <span className="text-foreground font-semibold">{weeklyGoal.current}</span> of {weeklyGoal.target} meals
                  </span>
                  <span className="text-primary font-medium">
                    {weeklyGoal.target - weeklyGoal.current} to go!
                  </span>
                </div>

                {/* Mini Stats - Hidden on mobile, shown on desktop */}
                <div className="hidden md:grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{currentUserStats.mealsShared}</div>
                    <div className="text-xs text-muted-foreground">Your Meals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">${currentUserStats.moneySaved}</div>
                    <div className="text-xs text-muted-foreground">You Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{currentUserStats.itemsRescued}</div>
                    <div className="text-xs text-muted-foreground">Items Rescued</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campus Leaderboard */}
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Award className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                Top Contributors
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">This week&apos;s heroes</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col gap-2 md:gap-3">
                {leaderboard.map((user, index) => (
                  <div
                    key={user.name}
                    className="flex items-center gap-3 p-2 md:p-2.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-5 md:w-6 text-center font-bold text-sm md:text-base text-muted-foreground">
                      {index + 1}
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs md:text-sm font-medium">
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate text-sm md:text-base">
                        {user.name}
                      </div>
                      <div className="text-[10px] md:text-xs text-muted-foreground">
                        {user.badge}
                      </div>
                    </div>
                    <div className="text-sm md:text-base font-semibold text-primary">
                      {user.meals}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements & Hubs */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          {/* Achievements */}
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Award className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                Your Achievements
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Milestones on your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col gap-2 md:gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                      achievement.completed
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-muted/50 border-border opacity-60'
                    }`}
                  >
                    <div
                      className={`h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        achievement.completed
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {achievement.completed ? (
                        <Award className="h-4 w-4 md:h-5 md:w-5" />
                      ) : (
                        <Target className="h-4 w-4 md:h-5 md:w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm md:text-base">
                        {achievement.title}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground truncate">
                        {achievement.description}
                      </div>
                    </div>
                    {achievement.completed && (
                      <Badge className="bg-primary text-primary-foreground text-[10px] md:text-xs flex-shrink-0">
                        Earned
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Campus Hubs */}
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                Hub Activity
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Activity across campus
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col gap-3">
                {hubActivity.map((hub, index) => (
                  <div key={hub.name} className="flex items-center gap-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center text-xs md:text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground text-xs md:text-sm truncate pr-2">
                          {hub.name}
                        </span>
                        <span className="text-[10px] md:text-xs text-muted-foreground flex-shrink-0">
                          {hub.exchanges} trades
                        </span>
                      </div>
                      <Progress value={hub.activity} className="h-1.5 md:h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Impact */}
        <Card className="mt-4 md:mt-6">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Leaf className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              Environmental Impact
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Your contribution to sustainability
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <EnvironmentStat
                value={Math.round(mockImpactStats.co2Avoided / 1000)}
                unit="tonnes"
                label="CO2 Prevented"
                equivalent="2,300 car trips"
              />
              <EnvironmentStat
                value={Math.round(mockImpactStats.foodRescued * 2.5)}
                unit="meals"
                label="Waste Diverted"
                equivalent="From landfills"
              />
              <EnvironmentStat
                value={Math.round(mockImpactStats.foodRescued * 1000)}
                unit="liters"
                label="Water Saved"
                equivalent="In production"
              />
              <EnvironmentStat
                value={Math.round(mockImpactStats.mealsShared * 0.5)}
                unit="trees"
                label="Carbon Offset"
                equivalent="Equivalent"
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function ImpactStatCard({
  icon,
  value,
  label,
  prefix = '',
  suffix = '',
  trend,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  trend?: string;
}) {
  return (
    <Card className="overflow-hidden min-w-[140px] md:min-w-0 snap-start flex-shrink-0 md:flex-shrink">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icon}
          </div>
          {trend && (
            <div className="flex items-center gap-0.5 text-[10px] md:text-xs text-primary">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </div>
          )}
        </div>
        <div className="text-lg md:text-xl font-bold text-foreground">
          {prefix}
          <AnimatedNumber end={value} />
          {suffix}
        </div>
        <div className="text-[10px] md:text-xs text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}

function EnvironmentStat({
  value,
  unit,
  label,
  equivalent,
}: {
  value: number;
  unit: string;
  label: string;
  equivalent: string;
}) {
  return (
    <div className="text-center p-3 md:p-4 rounded-xl bg-primary/5 border border-primary/10">
      <div className="text-xl md:text-3xl font-bold text-primary mb-0.5 md:mb-1">
        <AnimatedNumber end={value} />
      </div>
      <div className="text-[10px] md:text-sm text-muted-foreground mb-1 md:mb-2">{unit}</div>
      <div className="font-medium text-foreground text-xs md:text-sm leading-tight">{label}</div>
      <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1 hidden md:block">{equivalent}</div>
    </div>
  );
}
