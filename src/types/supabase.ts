export interface Database {
  public: {
    Tables: {
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          level: number;
          experience: number;
          streak: number;
          current_avatar_id: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          level?: number;
          experience?: number;
          streak?: number;
          current_avatar_id?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          level?: number;
          experience?: number;
          streak?: number;
          current_avatar_id?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      workout_days: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          completed: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          completed?: boolean;
          created_at?: string;
        };
      };
    };
  };
}