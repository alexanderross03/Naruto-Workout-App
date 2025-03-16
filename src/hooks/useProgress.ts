import { useState, useEffect } from 'react';
import { UserProgress, WorkoutDay } from '@/types';
import { format, isBefore, isEqual, addDays } from 'date-fns';
import { avatars } from '@/data/avatars';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import type { Avatar } from '@/types';

const initialProgress: UserProgress = {
  level: 1,
  experience: 0,
  streak: 0,
  workoutDays: [],
  currentAvatarId: 1,
};

export const useProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(initialProgress);

  // Fetch user progress from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      // Get user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get workout days
      const { data: workoutDays } = await supabase
        .from('workout_days')
        .select('*')
        .eq('user_id', user.id);

      if (progressData) {
        setProgress({
          level: progressData.level,
          experience: progressData.experience,
          streak: progressData.streak,
          currentAvatarId: progressData.current_avatar_id,
          workoutDays: workoutDays?.map((day: { date: string; completed: boolean }) => ({
            date: day.date,
            completed: day.completed
          })) || [],
        });
      } else {
        // Create initial progress for new user
        const { data } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            level: initialProgress.level,
            experience: initialProgress.experience,
            streak: initialProgress.streak,
            current_avatar_id: initialProgress.currentAvatarId,
          })
          .select()
          .single();

        if (data) {
          setProgress(initialProgress);
        }
      }
    };

    fetchProgress();
  }, [user]);

  const calculateStreak = (days: WorkoutDay[], lastWorkoutDate: string): number => {
    const sortedDays = [...days].sort((a, b) => a.date.localeCompare(b.date));
    let streak = 0;
    let currentDate = new Date(lastWorkoutDate);
    
    for (let i = sortedDays.length - 1; i >= 0; i--) {
      const workoutDate = new Date(sortedDays[i].date);
      
      if (isEqual(workoutDate, currentDate) && sortedDays[i].completed) {
        streak++;
        currentDate = addDays(currentDate, -1);
      } else if (isEqual(workoutDate, currentDate) && !sortedDays[i].completed) {
        break;
      } else if (isBefore(workoutDate, currentDate)) {
        break;
      }
    }
    
    return streak;
  };

  const updateAvatar = async (avatarId: number) => {
    if (!user) return;

    const avatar = avatars.find((a: Avatar) => a.id === avatarId);
    if (!avatar || progress.level < avatar.requiredLevel) return;

    try {
      await supabase
        .from('user_progress')
        .update({ current_avatar_id: avatarId })
        .eq('user_id', user.id);

      setProgress((prev: UserProgress) => ({
        ...prev,
        currentAvatarId: avatarId
      }));
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const markWorkout = async (completed: boolean, date = format(new Date(), 'yyyy-MM-dd'), expAmount = 50) => {
    if (!user) return;

    const existingDay = progress.workoutDays.find((day: WorkoutDay) => day.date === date);
    if (existingDay) return;

    // Add workout day
    const { data: newWorkoutDay } = await supabase
      .from('workout_days')
      .insert({
        user_id: user.id,
        date,
        completed,
      })
      .select()
      .single();

    if (!newWorkoutDay) return;

    const newWorkoutDays = [...progress.workoutDays, { date, completed }];
    let newExperience = progress.experience;
    let newLevel = progress.level;
    let newAvatarId = progress.currentAvatarId;

    if (completed) {
      newExperience += expAmount;

      while (newExperience >= newLevel * 100) {
        newExperience -= newLevel * 100;
        newLevel += 1;

        const nextAvatar = avatars.find(
          (avatar: Avatar) => avatar.requiredLevel === newLevel
        );
        if (nextAvatar) {
          newAvatarId = nextAvatar.id;
        }
      }
    }

    const newStreak = calculateStreak(newWorkoutDays, date);

    // Update user progress
    await supabase
      .from('user_progress')
      .update({
        level: newLevel,
        experience: newExperience,
        streak: newStreak,
        current_avatar_id: newAvatarId,
      })
      .eq('user_id', user.id);

    setProgress({
      level: newLevel,
      experience: newExperience,
      streak: newStreak,
      workoutDays: newWorkoutDays,
      currentAvatarId: newAvatarId,
    });
  };

  return {
    ...progress,
    markWorkout,
    updateAvatar,
  };
}