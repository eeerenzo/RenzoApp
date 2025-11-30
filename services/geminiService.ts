import { GoogleGenAI, Modality } from "@google/genai";
import { SpiritualPath, Gender, Tone, Language } from '../types';
import { getVoiceName } from '../constants';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';

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
  const model = 'gemini-pro';
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

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text || "Peace be with you. Today, we reflect on silence.";
  } catch (error) {
    console.error("Lesson Generation Error", error);
    return "Peace be with you. The spirits are quiet at this moment. Please try again later.";
  }
};

// 2. Generate Temple Background Image
export const generateTempleBackground = async (path: SpiritualPath): Promise<string | null> => {
  // Directly return fallback image without calling Gemini API
  return `https://picsum.photos/1920/1080?grayscale&blur=2`;
};

// 3. Generate Guru/Master Image
export const generateGuruImage = async (path: SpiritualPath, gender: Gender): Promise<string | null> => {
  // Feature disabled: return null immediately
  return null;
};

// 4. Generate Speech (TTS)
export const generateSpeech = async (text: string, gender: Gender, tone: Tone): Promise<string | null> => {
  // Feature disabled: return null immediately
  return null;
};
