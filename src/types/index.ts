export interface Avatar {
  id: number;
  name: string;
  image: string;
  requiredLevel: number;
}

export interface WorkoutDay {
  date: string;
  completed: boolean;
}

export interface UserProgress {
  level: number;
  experience: number;
  streak: number;
  workoutDays: WorkoutDay[];
  currentAvatarId: number;
}