import React, { useState } from 'react';
import { AdminPanel } from './AdminPanel';
import { Scroll, X } from 'lucide-react';

interface SecretScrollProps {
  onMarkWorkout: (completed: boolean, date: string, expAmount: number) => void;
}

export const SecretScroll: React.FC<SecretScrollProps> = ({ onMarkWorkout }) => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const SCROLL_PASSWORD = import.meta.env.VITE_FOOD_JUTSU_PASSWORD || 'hokage';

  const handleOpenScroll = () => {
    if (showAdmin) {
      setShowAdmin(false);
    } else {
      setShowPasswordPrompt(true);
      setPassword('');
      setError('');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === SCROLL_PASSWORD) {
      setShowAdmin(true);
      setShowPasswordPrompt(false);
      setPassword('');
      setError('');
    } else {
      setError('Incorrect password! Only the Hokage may open this scroll.');
    }
  };

  return (
    <div className="card bg-gradient-to-r from-naruto-scroll/90 to-naruto-orange/20 hover:from-naruto-scroll/90 hover:to-naruto-orange/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scroll className="h-8 w-8 text-naruto-orange animate-pulse" />
          <h2 className="text-2xl font-bold text-naruto-black">Secret Scroll</h2>
        </div>
        <button
          onClick={handleOpenScroll}
          className="px-6 py-2 rounded-lg bg-naruto-orange text-white font-medium 
                   transform transition-all duration-300 hover:scale-105 
                   hover:shadow-lg focus:ring-2 focus:ring-naruto-orange"
        >
          {showAdmin ? 'Hide Scroll' : 'Open Scroll'}
        </button>
      </div>

      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowPasswordPrompt(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-naruto-black mb-4">Enter Hokage Password</h3>
            
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
                Open Scroll
              </button>
            </form>
          </div>
        </div>
      )}
      
      {showAdmin && <div className="mt-6"><AdminPanel onMarkWorkout={onMarkWorkout} /></div>}
    </div>
  );
}