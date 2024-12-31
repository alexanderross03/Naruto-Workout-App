import React, { useState } from 'react';
import { format } from 'date-fns';
import { Avatar } from './components/Avatar';
import { Calendar } from './components/Calendar';
import { StreakCounter } from './components/StreakCounter';
import { AdminPanel } from './components/AdminPanel';
import { AuthForm } from './components/AuthForm';
import { useProgress } from './hooks/useProgress';
import { useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabase';

export default function App() {
  const { user, loading } = useAuth();
  const { level, experience, streak, workoutDays, currentAvatarId, markWorkout } = useProgress();
  const [showAdmin, setShowAdmin] = useState(false);
  const today = format(new Date(), 'EEEE, MMMM do');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-naruto-orange/20 to-naruto-blue/20 flex items-center justify-center">
        <div className="text-xl text-naruto-orange animate-pulse-glow">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-naruto-orange/20 to-naruto-blue/20 leaf-pattern flex items-center justify-center p-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-naruto-orange/20 to-naruto-blue/20 leaf-pattern py-8 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="card flex justify-between items-center">
          <h1 className="text-3xl font-bold text-naruto-orange animate-float">Ninja Training</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="btn-secondary"
            >
              {showAdmin ? 'Hide Scroll' : 'Secret Scroll'}
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="btn-primary"
            >
              Leave Village
            </button>
          </div>
        </div>
        
        <Avatar 
          level={level}
          experience={experience}
          currentAvatarId={currentAvatarId}
        />

        <StreakCounter streak={streak} />

        {showAdmin ? (
          <AdminPanel onMarkWorkout={markWorkout} />
        ) : (
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
        )}

        <Calendar workoutDays={workoutDays} />
      </div>
    </div>
  ); 
}