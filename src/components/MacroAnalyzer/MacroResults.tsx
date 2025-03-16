import React, { useState } from 'react';
import type { MacroData } from '@/types';

interface MacroResultsProps {
  data: MacroData;
  onSave: (data: MacroData) => void;
  isEditing?: boolean;
}

export const MacroResults: React.FC<MacroResultsProps> = ({ data, onSave, isEditing: isEditingProp = false }) => {
  const [editedData, setEditedData] = useState(data);
  const [isEditing, setIsEditing] = useState(isEditingProp);

  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Detected Food</h3>
        {!isEditingProp && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm text-naruto-blue hover:text-naruto-orange transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Description
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editedData.description}
              onChange={(e) => setEditedData({
                ...editedData,
                description: e.target.value
              })}
              className="w-full p-2 border rounded"
            />
          ) : (
            <p className="text-gray-700">{editedData.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(editedData.macros).map(([key, value]) => (
            <div key={key} className="bg-white/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={value.toString()}
                  onChange={(e) => setEditedData({
                    ...editedData,
                    macros: {
                      ...editedData.macros,
                      [key]: Number(e.target.value)
                    }
                  })}
                  className="w-full p-1 border rounded"
                />
              ) : (
                <span className="text-lg font-semibold text-naruto-black">
                  {value.toString()}{key === 'calories' ? ' kcal' : 'g'}
                </span>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            className="btn-primary w-full"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}