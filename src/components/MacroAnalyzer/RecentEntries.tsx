import React from 'react';
import { format } from 'date-fns';
import type { FoodEntry } from '@/types';
import { Edit2, Trash2 } from 'lucide-react';

interface RecentEntriesProps {
  entries: FoodEntry[];
  onEdit: (entry: FoodEntry) => void;
  onDelete: (id: string) => void;
}

export const RecentEntries: React.FC<RecentEntriesProps> = ({ entries, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-naruto-black">Recent Entries</h3>
      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-naruto-black">{entry.description}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(entry.created_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(entry)}
                  className="p-1 hover:text-naruto-orange transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-1 hover:text-naruto-red transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Calories:</span>
                <span className="ml-1 font-medium">{entry.calories}</span>
              </div>
              <div>
                <span className="text-gray-500">Protein:</span>
                <span className="ml-1 font-medium">{entry.protein}g</span>
              </div>
              <div>
                <span className="text-gray-500">Carbs:</span>
                <span className="ml-1 font-medium">{entry.carbs}g</span>
              </div>
              <div>
                <span className="text-gray-500">Fats:</span>
                <span className="ml-1 font-medium">{entry.fats}g</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}