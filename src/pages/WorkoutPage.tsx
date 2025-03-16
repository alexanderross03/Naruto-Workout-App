import React, { useState } from 'react';
import { Avatar } from '@/components/Avatar';
import { Calendar } from '@/components/Calendar';
import { StreakCounter } from '@/components/StreakCounter';
import { SecretScroll } from '@/components/SecretScroll';
import { useProgress } from '@/hooks/useProgress';
import { format } from 'date-fns';
import { Utensils, LogOut, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface WorkoutPageProps {
  onNavigateToMacros: () => void;
}

export const WorkoutPage: React.FC<WorkoutPageProps> = ({ onNavigateToMacros }) => {
  const { level, experience, streak, workoutDays, currentAvatarId, markWorkout, updateAvatar } = useProgress();
  const today = format(new Date(), 'EEEE, MMMM do');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleFoodJutsuClick = () => {
    setShowPasswordPrompt(true);
    setPassword('');
    setError('');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_FOOD_JUTSU_PASSWORD) {
      setShowPasswordPrompt(false);
      setPassword('');
      setError('');
      onNavigateToMacros();
    } else {
      setError('Incorrect password! This jutsu requires special training.');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <SecretScroll onMarkWorkout={markWorkout} />

      <div className="card">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-naruto-orange">Ninja Training</h1>
          <div className="flex gap-2">
            <button
              onClick={handleFoodJutsuClick}
              className="btn-primary flex items-center gap-2"
            >
              <Utensils size={18} />
              Food Jutsu
            </button>
            <button
              onClick={handleSignOut}
              className="btn-secondary flex items-center gap-2 bg-naruto-red hover:bg-red-600"
            >
              <LogOut size={18} />
              Leave Village
            </button>
          </div>
        </div>
      </div>
      
      <Avatar 
        level={level}
        experience={experience}
        currentAvatarId={currentAvatarId}
        onAvatarChange={updateAvatar}
      />

      <StreakCounter streak={streak} />

      <div className="card space-y-4">
        <h2 className="text-xl font-semibold text-naruto-black">{today}</h2>
        <div className="space-y-3">
          <button
            onClick={() => markWorkout(true)}
            className="btn-primary w-full animate-pulse-glow"
          >
            Completed Training! 🎯
          </button>
          <button
            onClick={() => markWorkout(false)}
            className="btn-secondary w-full"
          >
            Skip Training 😔
          </button>
        </div>
      </div>

      <Calendar workoutDays={workoutDays} />

      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowPasswordPrompt(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-naruto-black mb-4">Enter Food Jutsu Password</h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the secret password"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-naruto-orange focus:border-naruto-orange"
                  autoFocus
                />
              </div>
              
              {error && (
                <div className="text-naruto-red text-sm">{error}</div>
              )}
              
              <button
                type="submit"
                className="w-full px-6 py-2 rounded-lg bg-naruto-orange text-white font-medium 
                         transform transition-all duration-300 hover:scale-105 
                         hover:shadow-lg focus:ring-2 focus:ring-naruto-orange"
              >
                Access Food Jutsu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}