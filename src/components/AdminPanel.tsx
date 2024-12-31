import React, { useState } from 'react';
import { format } from 'date-fns';

interface AdminPanelProps {
  onMarkWorkout: (completed: boolean, date: string, expAmount: number) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onMarkWorkout }) => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [expAmount, setExpAmount] = useState(50);

  return (
    <div className="bg-naruto-scroll/90 p-6 rounded-xl shadow-md space-y-6 backdrop-blur-sm border-2 border-naruto-orange/20">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-naruto-black ">Secret Scroll</h2>
        <span className="px-3 py-1 bg-naruto-red/90 text-white text-xs rounded-full font-mediumn animate-pulse-glow ">Hokage Only</span>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-naruto-black/70">Training Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full p-3 rounded-lg bg-white/50 border border-naruto-orange/30 focus:ring-2 focus:ring-naruto-orange focus:border-naruto-orange transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-naruto-black/70">Chakra Points:</label>
        <input
          type="number"
          value={expAmount}
          onChange={(e) => setExpAmount(Number(e.target.value))}
          className="w-full p-3 rounded-lg bg-white/50 border border-naruto-orange/30 focus:ring-2 focus:ring-naruto-orange focus:border-naruto-orange transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4">
        <button
          onClick={() => onMarkWorkout(true, selectedDate, expAmount)}
          className="py-3 bg-konoha-green text-white rounded-lg hover:bg-green-600 transition-colors font-medium transform hover:scale-105"
        >
          Complete Mission
        </button>
        <button
          onClick={() => onMarkWorkout(false, selectedDate, expAmount)}
          className="py-3 bg-naruto-red text-white rounded-lg hover:bg-red-600 transition-colors font-medium transform hover:scale-105"
        >
          Failed Mission
        </button>
      </div>
    </div>
  );
}