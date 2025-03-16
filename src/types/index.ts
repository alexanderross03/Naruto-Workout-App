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

export interface MacroData {
  description: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface FoodEntry {
  id: string;
  user_id: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  created_at: string;
  updated_at: string;
}