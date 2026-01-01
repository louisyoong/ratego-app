
import { GoogleGenAI, Type } from "@google/genai";
import { MarketInsight } from "../types";

export const analyzeMarketTrends = async (
  baseCurrency: string,
  targetCurrency: string,
  currentRate: number,
  historicalTrend: string,
  language: string = 'en'
): Promise<MarketInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Analyze the current currency market trend for ${baseCurrency} to ${targetCurrency}. 
  Current Rate: ${currentRate}. 
  Historical context: ${historicalTrend}.
  
  Provide a professional financial insight including trend direction, concise analysis, recommendation for travelers/investors, and a volatility assessment.
  PLEASE RESPOND IN THIS LANGUAGE: ${language}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trend: { type: Type.STRING, enum: ['up', 'down', 'neutral'] },
            analysis: { type: Type.STRING },
            recommendation: { type: Type.STRING },
            volatility: { type: Type.STRING }
          },
          required: ["trend", "analysis", "recommendation", "volatility"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return data as MarketInsight;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      trend: 'neutral',
      analysis: "Unable to reach AI analysis at the moment. Market seems stable based on current technical indicators.",
      recommendation: "Monitor the rates closely before making large exchanges.",
      volatility: "Moderate"
    };
  }
};
