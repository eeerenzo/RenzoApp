import { SpiritualPath, Gender, Tone, VoiceConfig, Language } from './types';
import { BookOpen, Flower, Sun, Cross, User, Globe } from 'lucide-react';

export const PATHS = [
  {
    id: SpiritualPath.ZEN,
    label: 'Zen',
    description: 'Find clarity in simplicity and the present moment.',
    icon: Flower,
    color: 'text-emerald-400',
    borderColor: 'border-emerald-900/50',
    bgGradient: 'from-emerald-900/40 to-black'
  },
  {
    id: SpiritualPath.KRISHNA,
    label: 'Krishna',
    description: 'Devotion, love, and the divine play of the universe.',
    icon: Sun,
    color: 'text-blue-400',
    borderColor: 'border-blue-900/50',
    bgGradient: 'from-blue-900/40 to-black'
  },
  {
    id: SpiritualPath.BUDDHIST,
    label: 'Buddhism',
    description: 'Compassion, mindfulness, and the path to enlightenment.',
    icon: User,
    color: 'text-amber-400',
    borderColor: 'border-amber-900/50',
    bgGradient: 'from-amber-900/40 to-black'
  },
  {
    id: SpiritualPath.BRAHMA_KUMARIS,
    label: 'Brahma Kumaris',
    description: 'Soul consciousness and connection with the Supreme Soul.',
    icon: User, // Using generic user/soul icon
    color: 'text-purple-400',
    borderColor: 'border-purple-900/50',
    bgGradient: 'from-purple-900/40 to-black'
  },
  {
    id: SpiritualPath.CHRISTIAN,
    label: 'Christian',
    description: 'Faith, divine love, and the teachings of Christ.',
    icon: Cross,
    color: 'text-rose-400',
    borderColor: 'border-rose-900/50',
    bgGradient: 'from-rose-900/40 to-black'
  },
  {
    id: SpiritualPath.MULTI,
    label: 'Universal',
    description: 'A harmonious blend of wisdom from all traditions.',
    icon: Globe,
    color: 'text-indigo-400',
    borderColor: 'border-indigo-900/50',
    bgGradient: 'from-indigo-900/40 to-black'
  }
];

export const LANGUAGES = [
  { id: Language.ENGLISH, label: 'English' },
  { id: Language.ITALIAN, label: 'Italiano' },
  { id: Language.SPANISH, label: 'Español' },
  { id: Language.FRENCH, label: 'Français' },
  { id: Language.GERMAN, label: 'Deutsch' },
  { id: Language.HINDI, label: 'हिन्दी' },
  { id: Language.JAPANESE, label: '日本語' }
];

// Mapping intended UI options to Gemini 2.5 TTS Voices
// Available voices: Puck, Charon, Kore, Fenrir, Zephyr
export const VOICE_MAP: VoiceConfig[] = [
  { name: 'Puck', gender: Gender.MALE, tone: Tone.SERENE },
  { name: 'Fenrir', gender: Gender.MALE, tone: Tone.DEEP },
  { name: 'Kore', gender: Gender.FEMALE, tone: Tone.CALM },
  { name: 'Aoede', gender: Gender.FEMALE, tone: Tone.SERENE }, // Assumed available or mapped
  { name: 'Charon', gender: Gender.MALE, tone: Tone.CALM },
  // Using Zephyr as neutral/soft male-leaning
  { name: 'Zephyr', gender: Gender.NEUTRAL, tone: Tone.CALM },
];

export const getVoiceName = (gender: Gender, tone: Tone): string => {
  const match = VOICE_MAP.find(v => v.gender === gender && v.tone === tone);
  if (match) return match.name;
  
  // Fallbacks
  if (gender === Gender.FEMALE) return 'Kore';
  if (gender === Gender.MALE) return 'Fenrir';
  return 'Zephyr';
};