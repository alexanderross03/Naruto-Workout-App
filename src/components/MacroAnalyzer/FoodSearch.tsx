import React, { useState } from 'react';
import type { MacroData } from '@/types';

interface FoodSearchProps {
  onSelect: (data: MacroData) => void;
}

interface OFFProduct {
  product_name?: string;
  brands?: string;
  nutriments?: Record<string, any>;
  serving_size?: string;
}

export const FoodSearch: React.FC<FoodSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<OFFProduct[]>([]);
  const [servingGrams, setServingGrams] = useState<number>(100);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        query
      )}&search_simple=1&action=process&json=1&page_size=10`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.products || []);
    } catch (err) {
      console.error(err);
      setError('Failed to search foods. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toNumber = (val: any): number | undefined => {
    const n = Number(val);
    return isFinite(n) ? n : undefined;
  };

  const pickMacros = (p: OFFProduct, grams: number): MacroData | null => {
    const n = p.nutriments || {};
    const per100 = {
      calories: toNumber(n['energy-kcal_100g']),
      protein: toNumber(n['proteins_100g']),
      carbs: toNumber(n['carbohydrates_100g']),
      fats: toNumber(n['fat_100g'])
    } as { calories?: number; protein?: number; carbs?: number; fats?: number };

    if (per100.calories || per100.protein || per100.carbs || per100.fats) {
      return {
        description: `${p.product_name || 'Food'}${p.brands ? ` (${p.brands})` : ''} - ${grams}g`,
        macros: {
          calories: Math.round((per100.calories || 0) * (grams / 100)),
          protein: Number(((per100.protein || 0) * (grams / 100)).toFixed(1)),
          carbs: Number(((per100.carbs || 0) * (grams / 100)).toFixed(1)),
          fats: Number(((per100.fats || 0) * (grams / 100)).toFixed(1))
        }
      };
    }

    // Fallback to per serving if available and serving is in grams
    const kcalServing = toNumber(n['energy-kcal_serving']);
    const proteinServing = toNumber(n['proteins_serving']);
    const carbsServing = toNumber(n['carbohydrates_serving']);
    const fatsServing = toNumber(n['fat_serving']);

    if (
      typeof p.serving_size === 'string' &&
      /([0-9]+)\s*g/i.test(p.serving_size) &&
      (kcalServing || proteinServing || carbsServing || fatsServing)
    ) {
      const match = p.serving_size.match(/([0-9]+)\s*g/i);
      const servingG = match ? Number(match[1]) : 1;
      const factor = grams / servingG;
      return {
        description: `${p.product_name || 'Food'}${p.brands ? ` (${p.brands})` : ''} - ${grams}g`,
        macros: {
          calories: Math.round((kcalServing || 0) * factor),
          protein: Number(((proteinServing || 0) * factor).toFixed(1)),
          carbs: Number(((carbsServing || 0) * factor).toFixed(1)),
          fats: Number(((fatsServing || 0) * factor).toFixed(1))
        }
      };
    }

    return null;
  };

  const handleUse = (p: OFFProduct) => {
    const data = pickMacros(p, servingGrams);
    if (data) onSelect(data);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={search} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search foods (e.g., chicken breast, rice)"
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Serving size (g):</label>
        <input
          type="number"
          min={1}
          value={servingGrams}
          onChange={(e) => setServingGrams(Number(e.target.value))}
          className="w-24 p-1 border rounded"
        />
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-700">{error}</div>
      )}

      {results.length > 0 && (
        <div className="space-y-2 max-h-64 overflow-auto">
          {results.map((p, idx) => (
            <div key={idx} className="bg-white/60 p-3 rounded flex items-center justify-between">
              <div>
                <div className="font-medium text-naruto-black">{p.product_name || 'Unnamed product'}</div>
                <div className="text-xs text-gray-500">{p.brands}</div>
              </div>
              <button className="btn-secondary" onClick={() => handleUse(p)}>Use</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
