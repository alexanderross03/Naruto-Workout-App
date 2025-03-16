import React from 'react';
import { X, Lock } from 'lucide-react';
import { avatars } from '@/data/avatars';
import { clsx } from 'clsx';

interface AvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  currentAvatarId: number;
  onSelect: (avatarId: number) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  isOpen,
  onClose,
  currentLevel,
  currentAvatarId,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h3 className="text-2xl font-bold text-naruto-black mb-6">Choose Your Ninja Rank</h3>

        <div className="grid grid-cols-2 gap-4">
          {avatars.map((avatar) => {
            const isUnlocked = currentLevel >= avatar.requiredLevel;
            const isSelected = avatar.id === currentAvatarId;

            return (
              <button
                key={avatar.id}
                onClick={() => isUnlocked && onSelect(avatar.id)}
                disabled={!isUnlocked}
                className={clsx(
                  'relative p-4 rounded-xl border-2 transition-all duration-300',
                  isUnlocked ? (
                    isSelected
                      ? 'border-naruto-orange bg-naruto-orange/10 transform scale-105'
                      : 'border-gray-200 hover:border-naruto-orange/50 hover:bg-naruto-orange/5'
                  ) : (
                    'border-gray-200 opacity-50 cursor-not-allowed'
                  )
                )}
              >
                <div className="text-5xl mb-2">{avatar.image}</div>
                <div className="text-lg font-semibold text-naruto-black">{avatar.name}</div>
                <div className="text-sm text-gray-500">
                  Level {avatar.requiredLevel} Required
                </div>
                
                {!isUnlocked && (
                  <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                    <Lock className="text-white" size={32} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}