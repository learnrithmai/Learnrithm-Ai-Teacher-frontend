'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import {
  Trophy,
  Flame,
  Calendar,
  Star,
  Sparkles,
  Medal,
  PartyPopper
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  progress: number;
}

export function StreakCard({
  currentStreak,
  longestStreak,
  totalDays,
  progress,
}: StreakCardProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Milestone thresholds
  const milestones = [7, 14, 30, 60, 90];
  const currentMilestone = milestones.findIndex(m => currentStreak < m);
  const nextMilestone = milestones[currentMilestone];
  const daysToNextMilestone = nextMilestone - currentStreak;

  useEffect(() => {
    if (currentStreak > 0 && currentStreak % 5 === 0) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [currentStreak]);

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isHovering && 'transform scale-[1.02]'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <PartyPopper className="w-12 h-12 text-yellow-400 animate-bounce" />
          </div>
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20" />
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Current Streak Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Flame className={cn(
                "w-8 h-8 transition-all duration-300",
                currentStreak > 0 ? "text-orange-500 animate-pulse" : "text-gray-400"
              )} />
              {currentStreak} Day{currentStreak !== 1 ? 's' : ''} Streak!
            </h2>
            <p className="text-sm text-muted-foreground">
              Keep going! You&apos;re doing great! 🎉
            </p>
          </div>
          <div className="flex gap-2">
            {[...Array(Math.min(currentStreak, 5))].map((_, i) => (
              <Star
                key={i}
                className="w-6 h-6 text-yellow-400 animate-[wiggle_1s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to next milestone</span>
            <span>{daysToNextMilestone} days to go!</span>
          </div>
          <Progress
            value={progress}
            className="h-3 bg-secondary"
          >
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </Progress>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2 text-center p-4 bg-secondary/50 rounded-lg transition-colors hover:bg-secondary">
            <Trophy className="w-6 h-6 mx-auto text-yellow-500" />
            <div className="text-2xl font-bold">{longestStreak}</div>
            <div className="text-xs text-muted-foreground">Longest Streak</div>
          </div>
          <div className="space-y-2 text-center p-4 bg-secondary/50 rounded-lg transition-colors hover:bg-secondary">
            <Calendar className="w-6 h-6 mx-auto text-blue-500" />
            <div className="text-2xl font-bold">{totalDays}</div>
            <div className="text-xs text-muted-foreground">Total Days</div>
          </div>
          <div className="space-y-2 text-center p-4 bg-secondary/50 rounded-lg transition-colors hover:bg-secondary">
            <Medal className="w-6 h-6 mx-auto text-purple-500" />
            <div className="text-2xl font-bold">{currentMilestone}</div>
            <div className="text-xs text-muted-foreground">Achievements</div>
          </div>
        </div>

        {/* Milestone Preview */}
        <div className="relative p-4 bg-secondary/30 rounded-lg border border-dashed border-secondary">
          <Sparkles className="absolute right-4 top-4 w-5 h-5 text-yellow-400 animate-pulse" />
          <h3 className="font-semibold">Next Milestone: {nextMilestone} Days</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Just {daysToNextMilestone} more days to unlock a special achievement! 🏆
          </p>
        </div>
      </div>
    </Card>
  );
}