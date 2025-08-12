import React, { useState } from 'react';
import type { MacroData } from '@/types';

interface BarcodeLookupProps {
  onSelect: (data: MacroData) => void;
}

interface OFFProductResponse {
  status: number;
  product?: {
    product_name?: string;
    brands?: string;
    nutriments?: Record<string, any>;
    serving_size?: string;
  };
}

export const BarcodeLookup: React.FC<BarcodeLookupProps> = ({ onSelect }) => {
  const [barcode, setBarcode] = useState('');
  const [servingGrams, setServingGrams] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productName, setProductName] = useState<string | null>(null);

  const toNumber = (val: any): number | undefined => {
    const n = Number(val);
    return isFinite(n) ? n : undefined;
    };

  const pickMacros = (p: NonNullable<OFFProductResponse['product']>, grams: number): MacroData | null => {
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

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;

    setLoading(true);
    setError(null);
    setProductName(null);

    try {
      const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`;
      const res = await fetch(url);
      const data: OFFProductResponse = await res.json();

      if (data.status !== 1 || !data.product) {
        setError('Product not found for this barcode.');
        return;
      }

      setProductName(`${data.product.product_name || 'Food'}${data.product.brands ? ` (${data.product.brands})` : ''}`);
      const macroData = pickMacros(data.product, servingGrams);
      if (macroData) {
        onSelect(macroData);
      } else {
        setError('No nutrition data available for this product.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to lookup barcode. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={lookup} className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Enter or scan a barcode number"
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Lookup'}
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

      {productName && (
        <div className="text-sm text-gray-600">Using: {productName}</div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-700">{error}</div>
      )}

      <div className="text-xs text-gray-500">
        Tip: On mobile, use your camera app to scan a barcode and paste the number here.
      </div>
    </div>
  );
}
