
import React from 'react';
import { SpiritualPath, Gender, Tone, Language } from '../types';
import { PATHS, LANGUAGES } from '../constants';
import { Globe, ArrowRight } from 'lucide-react';

interface SelectionScreenProps {
  onSelect: (path: SpiritualPath, gender: Gender, tone: Tone, language: Language) => void;
}

const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect }) => {
  const [selectedPath, setSelectedPath] = React.useState<SpiritualPath | null>(null);
  const [selectedGender, setSelectedGender] = React.useState<Gender>(Gender.FEMALE);
  const [selectedTone, setSelectedTone] = React.useState<Tone>(Tone.CALM);
  const [selectedLanguage, setSelectedLanguage] = React.useState<Language>(Language.ENGLISH);

  const handleStart = () => {
    if (selectedPath) {
      onSelect(selectedPath, selectedGender, selectedTone, selectedLanguage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100">
      <div className="max-w-7xl w-full space-y-10 fade-in py-12">
        
        <header className="flex flex-col items-center space-y-6">
          
          {/* Orizzonte Comune Logo & Link */}
          <a 
            href="https://www.istitutosoleluna.it" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex flex-col items-center gap-3 transition-transform hover:scale-105"
            title="Visit Istituto Sole Luna"
          >
            {/* SVG Recreation of the 'Orizzonte Comune' Logo to ensure high quality without external assets */}
            <div className="bg-amber-50 p-3 rounded-2xl shadow-[0_0_25px_rgba(217,119,6,0.2)] border border-amber-100/20">
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Circle Border */}
                    <circle cx="50" cy="50" r="48" stroke="#6B7038" strokeWidth="3" />
                    
                    {/* Sun (Terra-cotta) */}
                    <path d="M25 50 A 25 25 0 0 1 75 50" fill="#C86B3C" />
                    
                    {/* Horizon/Hills (Olive Green) - Wavy shape */}
                    <path d="M2 50 C 2 50, 30 40, 50 55 C 70 70, 98 50, 98 50 L 98 75 C 98 88, 88 98, 75 98 L 25 98 C 12 98, 2 88, 2 75 Z" fill="#6B7038" />
                </svg>
            </div>
            
            <div className="flex flex-col items-center space-y-1">
                <h2 className="text-amber-100 font-serif text-lg tracking-wide leading-none group-hover:text-white transition-colors">
                    ORIZZONTE COMUNE
                </h2>
                <span className="text-amber-500/80 text-[10px] font-sans uppercase tracking-[0.3em] group-hover:text-amber-400 transition-colors">
                    Cerchi di Pace
                </span>
                <span className="text-gray-600 text-[9px] font-mono pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    www.istitutosoleluna.it
                </span>
            </div>
          </a>

          <div className="pt-4 text-center space-y-2">
            <h1 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 drop-shadow-lg">
                Virtual Temple
            </h1>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto italic">
                "Enter the sanctuary of your soul."
            </p>
          </div>
        </header>

        {/* Language & Path Selection Container */}
        <div className="space-y-8">
            
            {/* 1. Language Selector - Prominent */}
            <div className="flex justify-center">
                <div className="relative inline-flex items-center gap-3 bg-gray-800/80 backdrop-blur border border-gray-600 rounded-full px-6 py-3 shadow-lg hover:border-amber-500/50 transition-colors">
                    <Globe className="text-amber-400" size={24} />
                    <span className="text-gray-400 text-sm font-bold uppercase tracking-widest mr-2">Language:</span>
                    <select 
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                        className="bg-transparent border-none text-white text-lg font-serif focus:ring-0 cursor-pointer outline-none hover:text-amber-200"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang.id} value={lang.id} className="bg-gray-900 text-white">
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 2. Path Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 px-2">
            {PATHS.map((path) => {
                const Icon = path.icon;
                const isSelected = selectedPath === path.id;
                return (
                <button
                    key={path.id}
                    onClick={() => setSelectedPath(path.id)}
                    className={`
                    relative group p-4 rounded-xl border transition-all duration-300 flex flex-col items-center text-center h-full min-h-[160px] justify-between
                    ${isSelected 
                        ? `${path.borderColor} bg-gradient-to-b ${path.bgGradient} scale-105 shadow-2xl shadow-amber-900/20 ring-1 ring-amber-500/50` 
                        : 'border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-gray-600'
                    }
                    `}
                >
                    <div className={`mt-2 p-4 rounded-full bg-black/40 ${path.color} transition-transform group-hover:scale-110 duration-500`}>
                    <Icon size={28} />
                    </div>
                    <div className="mb-2">
                        <h3 className={`text-md font-serif ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                            {path.label}
                        </h3>
                        <p className="text-[10px] leading-tight text-gray-500 group-hover:text-gray-400 transition-colors mt-2 px-1">
                            {path.description}
                        </p>
                    </div>
                </button>
                );
            })}
            </div>
        </div>

        {/* 3. Voice Config & Start */}
        <div className={`transition-all duration-700 ease-in-out transform ${selectedPath ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none grayscale'}`}>
          <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 max-w-4xl mx-auto shadow-2xl">
            <h3 className="text-xl font-serif text-center mb-6 text-amber-100/80 tracking-widest uppercase text-sm border-b border-gray-800 pb-4 mx-auto w-1/2">
                Customize Your Guide
            </h3>
            
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              
              {/* Gender */}
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">Voice Gender</span>
                <div className="flex gap-2">
                  {Object.values(Gender).map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`px-5 py-2 rounded-lg text-sm border transition-all ${
                        selectedGender === g 
                          ? 'bg-amber-900/40 border-amber-500 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                          : 'bg-black/40 border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="hidden md:block w-px h-16 bg-gray-800"></div>

              {/* Tone */}
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">Voice Tone</span>
                <div className="flex gap-2">
                  {Object.values(Tone).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTone(t)}
                      className={`px-5 py-2 rounded-lg text-sm border transition-all ${
                        selectedTone === t 
                          ? 'bg-amber-900/40 border-amber-500 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                          : 'bg-black/40 border-gray-700 text-gray-500 hover:text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button
                onClick={handleStart}
                disabled={!selectedPath}
                className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-serif font-bold text-lg py-4 px-16 rounded-full shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10">Enter Temple</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 group-hover:animate-pulse"></div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SelectionScreen;
