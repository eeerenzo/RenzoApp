
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Download, Volume2, VolumeX, ArrowLeft, Music, Loader2 } from 'lucide-react';
import { AppState } from '../types';
import { ambientService } from '../services/ambientAudio';
import { rawPcmToWav, createAudioBufferFromRaw, bufferToWavBlob } from '../utils/audio';

interface TempleScreenProps {
  state: AppState;
  onReset: () => void;
}

const TempleScreen: React.FC<TempleScreenProps> = ({ state, onReset }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio from base64 RAW PCM
  useEffect(() => {
    if (state.audioBase64) {
      try {
        // 1. Decode base64 to byte array
        const binaryString = atob(state.audioBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // 2. Add WAV Header to Raw PCM so browser can play it
        const wavBlob = rawPcmToWav(bytes);
        const url = URL.createObjectURL(wavBlob);
        
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.load();
        }

        return () => URL.revokeObjectURL(url);
      } catch (e) {
        console.error("Audio initialization error", e);
      }
    }
  }, [state.audioBase64]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback error:", e));
      // Auto start ambient if not playing and user hits play on speech
      if (!isAmbientPlaying) {
        toggleAmbient();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleAmbient = async () => {
    if (isAmbientPlaying) {
      ambientService.stop();
    } else {
      await ambientService.start(0.2); // Start low volume
    }
    setIsAmbientPlaying(!isAmbientPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setAudioProgress(100);
  };

  // Complex Download: Mixes Speech + Ambient into a single WAV
  const downloadMixedAudio = async () => {
    if (!state.audioBase64) return;
    setIsDownloading(true);

    try {
        // 1. Decode Speech RAW Data
        const binaryString = atob(state.audioBase64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);

        // 2. Prepare OfflineContext
        const offlineCtx = new OfflineAudioContext(1, 44100 * 1, 24000); // Temp size, resized below
        
        // Decode raw speech to buffer to get duration
        const speechBuffer = await createAudioBufferFromRaw(offlineCtx, bytes);
        const duration = speechBuffer.duration;

        // 3. Create Real OfflineContext with correct duration
        // Adding 2 seconds tail for reverb/decay
        const finalCtx = new OfflineAudioContext(1, (duration + 2) * 24000, 24000); 

        // 4. Add Speech Source
        const speechSource = finalCtx.createBufferSource();
        speechSource.buffer = speechBuffer;
        speechSource.connect(finalCtx.destination);
        speechSource.start(0);

        // 5. Add Ambient Music Source (Procedural)
        // We reuse the service logic but passing the Offline Context
        ambientService.setupAmbientGraph(finalCtx, finalCtx.destination, 0.25);

        // 6. Render
        const renderedBuffer = await finalCtx.startRendering();

        // 7. Convert to WAV Blob
        const finalWavBlob = bufferToWavBlob(renderedBuffer);

        // 8. Trigger Download
        const url = URL.createObjectURL(finalWavBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Virtual_Temple_${state.path?.replace(/ /g, '_')}_${state.language}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    } catch (e) {
        console.error("Download mixing failed", e);
        alert("Could not generate mixed audio. Downloading speech only.");
        // Fallback to simple download
        if (audioRef.current?.src) {
             const a = document.createElement('a');
             a.href = audioRef.current.src;
             a.download = `Lesson_Speech_Only.wav`;
             a.click();
        }
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black fade-in flex flex-col font-sans">
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{ backgroundImage: `url(${state.backgroundUrl || 'https://picsum.photos/1920/1080?grayscale'})`, zIndex: 0 }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 md:p-6 flex-shrink-0">
          <button 
            onClick={() => {
                ambientService.stop();
                onReset();
            }}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/10"
          >
            <ArrowLeft size={18} />
            <span className="font-serif hidden sm:inline text-sm">Return to Gate</span>
          </button>
          
          <button 
              onClick={toggleAmbient}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 backdrop-blur-md ${isAmbientPlaying ? 'border-amber-500/50 text-amber-200 bg-amber-900/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'border-white/10 text-gray-400 bg-black/40 hover:bg-black/60'}`}
          >
              {isAmbientPlaying ? <Music size={18} /> : <VolumeX size={18} />}
              <span className="text-xs font-bold tracking-wider hidden sm:inline">{isAmbientPlaying ? 'AMBIENT ON' : 'AMBIENT OFF'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 px-4 md:px-8 pb-8 max-w-7xl mx-auto w-full overflow-hidden">
            
            {/* Visuals (Left/Top) */}
            <div className="relative flex-shrink-0 flex flex-col items-center">
                <div className="relative w-40 h-40 md:w-80 md:h-80 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/30 to-transparent rounded-full blur-3xl opacity-60 animate-pulse"></div>
                    {state.guruUrl ? (
                        <img 
                            src={state.guruUrl} 
                            alt="Spiritual Master" 
                            className="relative w-full h-full object-cover rounded-full border-4 border-amber-500/20 shadow-2xl"
                        />
                    ) : (
                        <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center border-4 border-gray-700">
                            <span className="text-gray-600 font-serif">Master's Presence</span>
                        </div>
                    )}
                    
                    {/* Audio Status Ring */}
                    {isPlaying && (
                         <div className="absolute inset-0 rounded-full border border-amber-400/50 animate-ping opacity-20"></div>
                    )}
                </div>
            </div>

            {/* Content Card (Right/Bottom) */}
            <div className="flex-1 w-full max-w-2xl bg-black/70 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col shadow-2xl overflow-hidden h-[50vh] md:h-[70vh]">
                
                {/* Scrollable Text */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                    <h2 className="text-2xl font-serif text-amber-100 mb-6 border-b border-white/10 pb-4 sticky top-0 bg-black/90 backdrop-blur-xl z-10 pt-2">
                        Lesson of the Day <span className="text-amber-500 text-lg block md:inline md:ml-2 opacity-80">- {state.path}</span>
                    </h2>
                    <p className="text-lg md:text-xl leading-relaxed text-gray-200 font-light whitespace-pre-wrap pb-8">
                        {state.lessonText || "The silence speaks..."}
                    </p>
                </div>

                {/* Player Controls (Fixed Footer) */}
                <div className="bg-gradient-to-t from-black to-black/90 border-t border-white/10 p-6 flex-shrink-0 z-20">
                    
                    {/* Progress */}
                    <div className="w-full bg-gray-700/50 h-1.5 rounded-full overflow-hidden mb-5">
                        <div 
                            className="bg-amber-500 h-full transition-all duration-300 shadow-[0_0_10px_rgba(245,158,11,0.8)]" 
                            style={{ width: `${audioProgress}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={togglePlay}
                                className="w-14 h-14 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg shadow-amber-900/50 transform hover:scale-105 active:scale-95"
                            >
                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                            </button>
                            <div className="flex flex-col">
                                <span className="text-sm text-amber-100 font-bold tracking-wider">
                                    {isPlaying ? "LISTENING" : "LISTEN NOW"}
                                </span>
                                <span className="text-xs text-gray-500 font-mono">
                                    {state.gender} Voice • {state.tone}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={downloadMixedAudio}
                            disabled={isDownloading}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest border ${
                                isDownloading 
                                ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-wait' 
                                : 'bg-gray-800/50 hover:bg-gray-700 border-white/10 text-gray-300 hover:text-white'
                            }`}
                        >
                            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            <span>{isDownloading ? 'Mixing...' : 'Save MP3'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Hidden Audio Element */}
        <audio 
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onError={(e) => console.error("Audio tag error", e)}
        />
      </div>
    </div>
  );
};

export default TempleScreen;
