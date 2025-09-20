// Fix: Import GoogleGenAI according to guidelines.
import { GoogleGenAI } from "@google/genai";

// Fix: Initialize GoogleGenAI client and define the model.
// The API key is sourced from environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = "gemini-2.5-flash";

// Fix: Implement function to get financial insights using Gemini with Google Search grounding.
export const getFinancialInsight = async (prompt: string): Promise<{ text: string, sources: {uri: string, title: string}[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Fix: Extract text directly from response.text as per guidelines.
    const text = response.text;
    
    // Fix: Extract grounding sources from the response.
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    let sources: {uri: string, title: string}[] = [];
    if (groundingMetadata?.groundingChunks) {
      sources = groundingMetadata.groundingChunks
        // Ensure chunk.web exists before mapping over it.
        .filter((chunk: any) => chunk?.web) 
        .map((chunk: any) => chunk.web)
        // Ensure uri and title exist.
        .filter((web: any) => web?.uri && web?.title) 
        .map((web: any) => ({ uri: web.uri, title: web.title }));
    }

    // Deduplicate sources based on URI to avoid showing the same link multiple times.
    const uniqueSources = Array.from(new Map(sources.map(item => [item['uri'], item])).values());

    return { text, sources: uniqueSources };
  } catch (error) {
    console.error("Error getting financial insight from Gemini:", error);
    // Fix: Implement robust error handling for API calls.
    if (error instanceof Error) {
        if (error.message.includes('429')) {
             return { text: "I'm experiencing high demand right now. Please try again in a moment.", sources: [] };
        }
         if (error.message.includes('API key not valid')) {
             return { text: "There seems to be an issue with the configuration. Please check the API key.", sources: [] };
        }
    }
    return { text: "Sorry, I couldn't process your request. Please try again later.", sources: [] };
  }
};
