export enum SpiritualPath {
  ZEN = 'Zen Buddhism',
  KRISHNA = 'Krishna Consciousness',
  BUDDHIST = 'Buddhism',
  BRAHMA_KUMARIS = 'Brahma Kumaris',
  CHRISTIAN = 'Christian Mysticism',
  MULTI = 'Universal Harmony'
}

export enum Language {
  ENGLISH = 'English',
  ITALIAN = 'Italian',
  SPANISH = 'Spanish',
  FRENCH = 'French',
  GERMAN = 'German',
  HINDI = 'Hindi',
  JAPANESE = 'Japanese'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  NEUTRAL = 'Neutral' // Using a balanced voice
}

export enum Tone {
  CALM = 'Calm',
  SERENE = 'Serene',
  DEEP = 'Deep'
}

export interface AppState {
  language: Language;
  path: SpiritualPath | null;
  gender: Gender;
  tone: Tone;
  isLoading: boolean;
  lessonText: string | null;
  audioBase64: string | null;
  backgroundUrl: string | null;
  guruUrl: string | null;
  loadingStep: string;
}

export interface VoiceConfig {
  name: string; // The API voice name
  gender: Gender;
  tone: Tone;
}