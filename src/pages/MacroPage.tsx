import React from 'react';
import { MacroAnalyzer } from '@/components/MacroAnalyzer';
import { ArrowLeft } from 'lucide-react';

interface MacroPageProps {
  onNavigateToWorkout: () => void;
}

export const MacroPage: React.FC<MacroPageProps> = ({ onNavigateToWorkout }) => {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="card flex justify-between items-center">
        <h1 className="text-3xl font-bold text-naruto-orange animate-float">Food Analysis Jutsu</h1>
        <button
          onClick={onNavigateToWorkout}
          className="btn-primary flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Training
        </button>
      </div>

      <MacroAnalyzer />
    </div>
  );
}