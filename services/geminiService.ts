import { GoogleGenAI, Modality } from "@google/genai";
import { SpiritualPath, Gender, Tone, Language } from '../types';
import { getVoiceName } from '../constants';

const API_KEY = process.env.API_KEY || ''; 

// Initialize GenAI
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to get time of day context
const getTimeContext = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning (focus on awakening, clarity, and energy for the day)";
  if (hour < 18) return "afternoon (focus on mindfulness, balance, and pausing amidst work)";
  return "evening or night (focus on reflection, peace, winding down, and rest)";
};

// 1. Generate Lesson Text
export const generateDailyLesson = async (path: SpiritualPath, language: Language): Promise<string> => {
  const model = 'gemini-2.5-flash';
  const timeContext = getTimeContext();
  
  const prompt = `
    Act as a wise, compassionate spiritual master from the ${path} tradition.
    Create a unique "Daily Lesson" for a seeker who has entered the temple right now.
    
    Current context: It is currently ${timeContext}. Adjust your greeting and the theme of the lesson to match this time of day.
    
    IMPORTANT: Write the entire response in ${language}.
    
    Structure:
    1. A warm, serene greeting appropriate for the ${timeContext}.
    2. A core spiritual concept relevant to ${path} (approx 200 words).
    3. A practical mindfulness exercise or reflection for this specific moment (approx 100 words).
    4. A blessing or closing thought.
    
    Total length should be substantial enough for a 3-5 minute spoken session.
    Do not use markdown formatting like bolding or headers, write it strictly as a speech script to be read aloud.
    Ensure the content is fresh and unique, avoiding generic repetition.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "Peace be with you. Today, we reflect on silence.";
};

// 2. Generate Temple Background Image
export const generateTempleBackground = async (path: SpiritualPath): Promise<string | null> => {
  try {
    const prompt = `A breathtaking, photorealistic, wide-angle view of a serene ${path} temple interior. 
    Soft, divine lighting, atmospheric fog, ancient architecture, spiritual symbols of ${path}. 
    Symmetrical composition, peaceful ambiance, high detail, 4k resolution. 
    No people, just the sacred space.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using the standard generation model available
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        // requesting 1:1 or 16:9 if possible, defaulting to square for this model usually
      }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Bg Gen Error", error);
    // Fallback images if generation fails or quotas hit
    return `https://picsum.photos/1920/1080?grayscale&blur=2`;
  }
  return null;
};

// 3. Generate Guru/Master Image
export const generateGuruImage = async (path: SpiritualPath, gender: Gender): Promise<string | null> => {
  try {
    const prompt = `A portrait of a wise spiritual master of the ${path} tradition, ${gender} gender.
    Sitting in meditation, serene expression, glowing aura, traditional robes.
    Oil painting style, soft lighting, ethereal, benevolent.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Guru Gen Error", error);
    return null;
  }
  return null;
};

// 4. Generate Speech (TTS)
export const generateSpeech = async (text: string, gender: Gender, tone: Tone): Promise<string | null> => {
  const voiceName = getVoiceName(gender, tone);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS Error", error);
    return null;
  }
};