import React from 'react';
import ReactCalendar from 'react-calendar';
import { format } from 'date-fns';
import { WorkoutDay } from '@/types';
import 'react-calendar/dist/Calendar.css';

interface CalendarProps {
  workoutDays: WorkoutDay[];
}

export const Calendar: React.FC<CalendarProps> = ({ workoutDays }) => {
  const tileClassName = ({ date }: { date: Date }) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const workoutDay = workoutDays.find(day => day.date === formattedDate);
    
    if (!workoutDay) return '';
    return workoutDay.completed ? 'bg-green-200 hover:bg-green-300 rounded-full font-bold' : 'bg-red-200 hover:bg-red-300 rounded-full';
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <ReactCalendar
        tileClassName={tileClassName}
        className="border-0 w-full"
      />
    </div>
  );
}