import React, { useState } from 'react';
import { AppState, SpiritualPath, Gender, Tone, Language } from './types';
import SelectionScreen from './components/SelectionScreen';
import LoadingScreen from './components/LoadingScreen';
import TempleScreen from './components/TempleScreen';
import { generateDailyLesson, generateSpeech, generateTempleBackground, generateGuruImage } from './services/geminiService';

const initialState: AppState = {
  path: null,
  gender: Gender.FEMALE,
  tone: Tone.CALM,
  language: Language.ENGLISH,
  isLoading: false,
  lessonText: null,
  audioBase64: null,
  backgroundUrl: null,
  guruUrl: null,
  loadingStep: ''
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(initialState);

  const handleSelection = async (path: SpiritualPath, gender: Gender, tone: Tone, language: Language) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      path, 
      gender, 
      tone, 
      language,
      loadingStep: 'Connecting to universal consciousness...' 
    }));

    try {
      // 1. Generate Text
      setState(prev => ({ ...prev, loadingStep: 'Channeling wisdom...' }));
      const lessonText = await generateDailyLesson(path, language);

      // 2. Parallel Generation for Visuals and Audio
      // We start them together to save time
      setState(prev => ({ ...prev, lessonText, loadingStep: 'Manifesting temple visuals & voice...' }));

      const [bgUrl, guruUrl, audioData] = await Promise.all([
        generateTempleBackground(path),
        generateGuruImage(path, gender),
        generateSpeech(lessonText, gender, tone)
      ]);

      setState(prev => ({
        ...prev,
        backgroundUrl: bgUrl,
        guruUrl: guruUrl,
        audioBase64: audioData,
        isLoading: false
      }));

    } catch (error) {
      console.error("Sequence Error", error);
      // Handle error gracefully in a real app, reset for now
      alert("The spirits are quiet today (API Error). Please try again.");
      setState(initialState);
    }
  };

  const reset = () => {
    setState(initialState);
  };

  if (state.isLoading) {
    return <LoadingScreen state={state} />;
  }

  if (state.lessonText && state.path) {
    return <TempleScreen state={state} onReset={reset} />;
  }

  return <SelectionScreen onSelect={handleSelection} />;
};

export default App;