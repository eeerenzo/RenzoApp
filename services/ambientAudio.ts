
/**
 * Procedural Audio Service
 * Generates calming ambient music and melodies.
 * Supports both real-time playback and offline rendering for downloads.
 */

export class AmbientAudioService {
  private ctx: AudioContext | null = null;
  private nodes: AudioNode[] = [];
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {}

  /**
   * Generates the ambient graph on a given context (Offline or Realtime)
   */
  public setupAmbientGraph(ctx: BaseAudioContext, destination: AudioNode, volume: number = 0.3) {
    const master = ctx.createGain();
    master.gain.value = volume;
    master.connect(destination);

    const nodes: AudioNode[] = [];

    // 1. Warm Pad (Drones) - Pentatonic-ish Cluster
    // Frequencies for a spiritual/calm feel (C Major Pentatonic based around 432Hz)
    // C4=256(ish), G4=384, A4=432, C5=512
    const padFreqs = [216, 256, 324, 384]; 
    
    padFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      // Detune for warmth
      osc.detune.value = Math.random() * 10 - 5;
      
      // Filter to soften
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      // Connections
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      // Slow breathing LFO for volume
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.05 + (Math.random() * 0.05); // Very slow
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.1; // Depth
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      
      osc.start();
      lfo.start();
      
      // Set initial volume slightly random
      gain.gain.value = 0.05 + (Math.random() * 0.05);

      nodes.push(osc, gain, filter, lfo, lfoGain);
    });

    // 2. Wind Chimes / Random Melody
    // Pentatonic Scale: C, D, E, G, A
    const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    
    const playChime = () => {
        if (ctx.state === 'closed') return; // Stop if context is dead
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const freq = scale[Math.floor(Math.random() * scale.length)];
        
        osc.frequency.value = freq;
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1); // Attack
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0); // Decay

        osc.connect(gain);
        gain.connect(master);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 3.5);

        // Schedule next chime if this is a realtime context
        // For OfflineContext, we just schedule a bunch upfront
        if (ctx instanceof AudioContext) {
           setTimeout(playChime, 2000 + Math.random() * 3000); 
        }
    };

    // If offline, we must schedule strictly by time
    if (ctx instanceof OfflineAudioContext) {
        // Schedule chimes throughout the duration
        const duration = ctx.length / ctx.sampleRate;
        let t = 0;
        while(t < duration) {
            t += 2 + Math.random() * 3;
            if (t >= duration) break;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const freq = scale[Math.floor(Math.random() * scale.length)];
            
            osc.frequency.setValueAtTime(freq, t);
            osc.type = 'sine';
            
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.15, t + 0.1); 
            gain.gain.exponentialRampToValueAtTime(0.001, t + 3.0);

            osc.connect(gain);
            gain.connect(master);
            
            osc.start(t);
            osc.stop(t + 3.5);
        }
    } else {
        // Start the loop for realtime
        playChime();
    }

    return { master, nodes };
  }

  public async start(volume: number = 0.3) {
    if (this.isPlaying) return;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Resume context if suspended (browser policy)
    if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
    }

    const { master, nodes } = this.setupAmbientGraph(this.ctx, this.ctx.destination, volume);
    
    this.masterGain = master;
    this.nodes = nodes;
    this.isPlaying = true;
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.5);
    }
  }

  public stop() {
    if (!this.isPlaying) return;
    
    // Ramp down for smooth stop
    if (this.masterGain && this.ctx) {
         this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
    }
    
    setTimeout(() => {
        this.nodes.forEach(n => {
            try { n.disconnect(); } catch(e) {}
            // Stop oscillators
            if (n instanceof OscillatorNode) {
                try { n.stop(); } catch(e) {}
            }
        });
        
        if (this.ctx) this.ctx.close();
        
        this.nodes = [];
        this.ctx = null;
        this.isPlaying = false;
    }, 600);
  }
}

export const ambientService = new AmbientAudioService();
