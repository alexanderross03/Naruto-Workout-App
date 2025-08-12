import React, { useState, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import { MacroResults } from './MacroResults';
import { RecentEntries } from './RecentEntries';
import { FoodSearch } from './FoodSearch';
import { BarcodeLookup } from './BarcodeLookup';
import { analyzeFoodImage } from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { MacroData, FoodEntry } from '@/types';
import { isToday } from 'date-fns';

export const MacroAnalyzer: React.FC = () => {
  const { user } = useAuth();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);
  const [editMacroData, setEditMacroData] = useState<MacroData | null>(null);
  const [activeTab, setActiveTab] = useState<'image' | 'search' | 'barcode'>('image');

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

  const refreshEntries = async () => {
    if (!user) return;
    const { data: newEntries, error: fetchError } = await supabase
      .from('food_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;
    if (newEntries) setEntries(newEntries);
  };

  const addEntry = async (data: MacroData) => {
    if (!user) return;
    try {
      const { error: insertError } = await supabase
        .from('food_entries')
        .insert({
          user_id: user.id,
          description: data.description,
          calories: data.macros.calories,
          protein: data.macros.protein,
          carbs: data.macros.carbs,
          fats: data.macros.fats,
        });

      if (insertError) throw insertError;
      await refreshEntries();
      setActiveTab('image');
    } catch (err) {
      console.error('Error adding entry:', err);
      setError('Failed to add entry. Please try again.');
    }
  };

  const handleImageUpload = async (image: File) => {
    setAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeFoodImage(image);
      await addEntry(result);
    } catch (err) {
      console.error('Error processing image:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setAnalyzing(false);
      setEditingEntry(null);
      setEditMacroData(null);
    }
  };

  const handleSearchSelect = async (data: MacroData) => {
    await addEntry(data);
  };

  const handleBarcodeSelect = async (data: MacroData) => {
    await addEntry(data);
  };

  const handleEdit = async (entry: FoodEntry) => {
    setEditingEntry(entry);
    setEditMacroData({
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
      setEntries(entries.filter((entry) => entry.id !== id));
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
      await refreshEntries();
      setEditingEntry(null);
      setEditMacroData(null);
    } catch (err) {
      console.error('Error updating entry:', err);
      setError('Failed to update entry. Please try again.');
    }
  };

  const todaysTotals = entries
    .filter((e) => isToday(new Date(e.created_at)))
    .reduce(
      (acc, e) => {
        acc.calories += e.calories || 0;
        acc.protein += e.protein || 0;
        acc.carbs += e.carbs || 0;
        acc.fats += e.fats || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

  const latest = entries[0];

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-naruto-orange">Food Jutsu</h2>
        {analyzing && <div className="text-naruto-orange animate-pulse">Analyzing... 🔍</div>}
      </div>

      <div className="bg-white/60 rounded-lg p-2 flex gap-2">
        <button
          className={`px-3 py-2 rounded ${activeTab === 'image' ? 'bg-naruto-orange text-white' : 'hover:bg-white'}`}
          onClick={() => setActiveTab('image')}
        >
          Image
        </button>
        <button
          className={`px-3 py-2 rounded ${activeTab === 'search' ? 'bg-naruto-orange text-white' : 'hover:bg-white'}`}
          onClick={() => setActiveTab('search')}
        >
          Search
        </button>
        <button
          className={`px-3 py-2 rounded ${activeTab === 'barcode' ? 'bg-naruto-orange text-white' : 'hover:bg-white'}`}
          onClick={() => setActiveTab('barcode')}
        >
          Barcode
        </button>
      </div>

      {activeTab === 'image' && <ImageUploader onUpload={handleImageUpload} disabled={analyzing} />}
      {activeTab === 'search' && <FoodSearch onSelect={handleSearchSelect} />}
      {activeTab === 'barcode' && <BarcodeLookup onSelect={handleBarcodeSelect} />}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {entries.length > 0 && (
        <div className="bg-white/90 p-4 rounded-lg space-y-3">
          <h3 className="text-xl font-semibold text-naruto-orange">Today's Intake</h3>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div><span className="text-gray-500">Calories:</span> <span className="font-medium">{todaysTotals.calories}</span></div>
            <div><span className="text-gray-500">Protein:</span> <span className="font-medium">{todaysTotals.protein}g</span></div>
            <div><span className="text-gray-500">Carbs:</span> <span className="font-medium">{todaysTotals.carbs}g</span></div>
            <div><span className="text-gray-500">Fats:</span> <span className="font-medium">{todaysTotals.fats}g</span></div>
          </div>
        </div>
      )}

      {latest && (
        <div className="bg-white/90 p-6 rounded-lg shadow-md space-y-2">
          <h3 className="text-xl font-semibold text-naruto-orange">Most Recent Entry</h3>
          <div className="font-medium text-naruto-black">{latest.description}</div>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div><span className="text-gray-500">Calories:</span> <span className="font-medium">{latest.calories}</span></div>
            <div><span className="text-gray-500">Protein:</span> <span className="font-medium">{latest.protein}g</span></div>
            <div><span className="text-gray-500">Carbs:</span> <span className="font-medium">{latest.carbs}g</span></div>
            <div><span className="text-gray-500">Fats:</span> <span className="font-medium">{latest.fats}g</span></div>
          </div>
        </div>
      )}

      {editingEntry && editMacroData && (
        <div className="bg-white/90 p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-semibold text-naruto-orange">Edit Entry</h3>
          <MacroResults data={editMacroData} onSave={handleSave} isEditing={true} />
        </div>
      )}

      {entries.length > 0 && (
        <RecentEntries entries={entries} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
