import React from 'react';
import { avatars } from '@/data/avatars';

interface AvatarProps {
  level: number;
  experience: number;
  currentAvatarId: number;
}

export const Avatar: React.FC<AvatarProps> = ({ level, experience, currentAvatarId }) => {
  const currentAvatar = avatars.find(avatar => avatar.id === currentAvatarId);
  const experienceToNextLevel = level * 100;
  const progress = (experience / experienceToNextLevel) * 100;

  return (
    <div className="bg-white/90 p-6 rounded-xl shadow-md text-center backdrop-blur-sm">
      <div className="text-7xl mb-4 transform hover:scale-110 transition-transform cursor-pointer">
        {currentAvatar?.image}
      </div>
      <h2 className="text-2xl font-bold text-naruto-black mb-2">{currentAvatar?.name}</h2>
      <div className="text-lg text-naruto-orange font-semibold mb-4">Level {level}</div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div className="text-xs font-semibold text-naruto-blue uppercase">
            Next Rank Progress
          </div>
          <div className="text-xs font-semibold text-naruto-blue">
            {experience}/{experienceToNextLevel} XP
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-naruto-orange/20">
          <div 
            style={{ width: `${progress}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-naruto-orange to-naruto-red transition-all duration-500"
          ></div>
        </div>
      </div>
    </div>
  );
}