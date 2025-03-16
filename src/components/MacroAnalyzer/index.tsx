import React, { useState, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import { MacroResults } from './MacroResults';
import { RecentEntries } from './RecentEntries';
import { analyzeFoodImage } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { MacroData, FoodEntry } from '@/types';

export const MacroAnalyzer: React.FC = () => {
  const { user } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [macroData, setMacroData] = useState<MacroData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchEntries = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('food_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setEntries(data || []);
      } catch (err) {
        console.error('Error fetching entries:', err);
        setError('Failed to load food entries. Please try again.');
      }
    };

    fetchEntries();
  }, [user]);

  const handleImageUpload = async (image: File) => {
    setAnalyzing(true);
    setError(null);
    
    try {
      const result = await analyzeFoodImage(image);
      setMacroData(result); // Set the latest analysis result
      
      if (user) {
        const { error: insertError } = await supabase
          .from('food_entries')
          .insert({
            user_id: user.id,
            description: result.description,
            calories: result.macros.calories,
            protein: result.macros.protein,
            carbs: result.macros.carbs,
            fats: result.macros.fats,
          });

        if (insertError) throw insertError;

        // Refresh entries
        const { data: newEntries, error: fetchError } = await supabase
          .from('food_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        if (newEntries) {
          setEntries(newEntries);
        }
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setAnalyzing(false);
      setEditingEntry(null); // Clear editing state after upload
    }
  };

  const handleEdit = async (entry: FoodEntry) => {
    setEditingEntry(entry);
    setMacroData({
      description: entry.description,
      macros: {
        calories: entry.calories,
        protein: entry.protein,
        carbs: entry.carbs,
        fats: entry.fats,
      },
    });
  };

  const handleDelete = async (id: string) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('food_entries')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError('Failed to delete entry. Please try again.');
    }
  };

  const handleSave = async (data: MacroData) => {
    if (!user || !editingEntry) return;

    try {
      const { error: updateError } = await supabase
        .from('food_entries')
        .update({
          description: data.description,
          calories: data.macros.calories,
          protein: data.macros.protein,
          carbs: data.macros.carbs,
          fats: data.macros.fats,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingEntry.id);

      if (updateError) throw updateError;

      // Refresh entries
      const { data: newEntries, error: fetchError } = await supabase
        .from('food_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      if (newEntries) {
        setEntries(newEntries);
      }

      setEditingEntry(null);
      setMacroData(null);
    } catch (err) {
      console.error('Error updating entry:', err);
      setError('Failed to update entry. Please try again.');
    }
  };

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-naruto-orange">Food Analysis Jutsu</h2>
        {analyzing && (
          <div className="text-naruto-orange animate-pulse">
            Analyzing... 🔍
          </div>
        )}
      </div>

      <ImageUploader onUpload={handleImageUpload} disabled={analyzing} />
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {!editingEntry && macroData && (
        <div className="bg-white/90 p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-semibold text-naruto-orange">Latest Analysis</h3>
          <MacroResults 
            data={macroData}
            onSave={() => {}}
            isEditing={false}
          />
        </div>
      )}
      
      {editingEntry && macroData && (
        <div className="bg-white/90 p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-semibold text-naruto-orange">Edit Entry</h3>
          <MacroResults 
            data={macroData}
            onSave={handleSave}
            isEditing={true}
          />
        </div>
      )}

      {entries.length > 0 && (
        <RecentEntries 
          entries={entries}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}