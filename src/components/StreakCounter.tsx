import React from 'react';
import { Flame } from 'lucide-react';

interface StreakCounterProps {
  streak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  return (
    <div className="bg-gradient-to-r from-naruto-orange to-naruto-red p-4 rounded-xl shadow-md">
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-lg">
          <Flame className="text-white" size={32} />
        </div>
        <div>
          <div className="text-white/80 font-medium">Ninja Way Streak</div>
          <div className="text-3xl font-bold text-white">{streak} days</div>
        </div>
      </div>
    </div>
  );
}