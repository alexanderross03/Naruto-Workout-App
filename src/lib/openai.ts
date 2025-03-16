import OpenAI from 'openai';
import type { MacroData } from '@/types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function analyzeFoodImage(image: File): Promise<MacroData> {
  const base64Image = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(image);
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional nutritionist and food analyst. Your task is to:
1. Precisely identify food items, portions, and preparation methods
2. Calculate exact macro breakdowns based on standard USDA database values
3. Consider portion sizes, cooking methods, and visible ingredients
4. Provide detailed measurements in grams/ounces where possible
5. Account for added oils, sauces, and condiments in calculations
6. Break down mixed dishes into their components for accurate macro assessment`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this food image and provide precise macro estimates. Include portion sizes and detailed breakdown. Return ONLY a JSON object with this exact format: { \"description\": \"detailed food description with portion sizes\", \"macros\": { \"calories\": number, \"protein\": number, \"carbs\": number, \"fats\": number } }"
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image
              }
            }
          ]
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    try {
      const cleanedContent = content.replace(/```json\s*|\s*```/g, '').trim();
      return JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid response format from OpenAI');
    }
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a few moments.');
    }
    if (error.response?.status === 400) {
      throw new Error('Invalid request. Please check the image format and try again.');
    }
    
    throw new Error('Failed to analyze image. Please try again.');
  }
}