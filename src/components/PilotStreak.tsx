"use client";

import React from 'react';
import { UK_CAA_DATA } from '@/data/uk-drone-regulations';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Calendar, Info } from 'lucide-react';
// If you have a Tooltip component, import it here
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PilotStreakProps {
  currentStreak?: number;
  lastFlightDaysAgo?: number;
}

const PilotStreak: React.FC<PilotStreakProps> = ({ currentStreak = 5, lastFlightDaysAgo = 12 }) => {
  const { logged_time, period_days } = UK_CAA_DATA.currency_requirements;

  // Logic: Calculate how close the pilot is to losing 'Active' status
  const daysRemaining = period_days - lastFlightDaysAgo;
  const statusColor = daysRemaining < 10 ? 'text-red-500' : 'text-orange-500';

  return (
    <Card className="w-full max-w-sm border-orange-200 bg-orange-50/30">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-full">
              <Flame className={`w-6 h-6 ${statusColor} fill-current`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Learning Streak
              </p>
              <h3 className="text-2xl font-black">{currentStreak} Days</h3>
            </div>
          </div>

          {/* Tooltip can be added here if available */}
          <div className="cursor-help p-2 hover:bg-orange-100 rounded-full transition-colors">
            <Info className="w-5 h-5 text-orange-400" />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-orange-100">
          <div className="flex items-center gap-2 text-sm text-orange-800 font-medium">
            <Calendar className="w-4 h-4" />
            <span>Currency Window: {daysRemaining} days left</span>
          </div>
          <p className="mt-1 text-xs text-orange-600/80 leading-relaxed">
            {UK_CAA_DATA.currency_requirements.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PilotStreak;
