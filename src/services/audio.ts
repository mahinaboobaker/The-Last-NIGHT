/**
 * Web Audio API horror sound synthesizer
 * Fully procedural without external audio asset dependencies
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private isMuted: boolean = false;
  private masterVolume: number = 0.8;
  private musicVolume: number = 0.6;
  private sfxVolume: number = 0.9;

  // Background ambient nodes
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private ambientFilter: BiquadFilterNode | null = null;
  private isAmbientPlaying: boolean = false;

  // Heartbeat loop timer
  private heartbeatInterval: number | null = null;
  private heartbeatBpm: number = 60;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(master: number, music: number, sfx: number, muted: boolean = false) {
    this.masterVolume = master;
    this.musicVolume = music;
    this.sfxVolume = sfx;
    this.isMuted = muted;

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : master, this.ctx.currentTime);
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(music, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(sfx, this.ctx.currentTime);
    }
  }

  // Start dark eerie ambient drone
  public startAmbient() {
    try {
      this.initContext();
      if (!this.ctx || !this.musicGain || this.isAmbientPlaying) return;

      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientFilter = this.ctx.createBiquadFilter();

      this.ambientOsc1.type = 'sawtooth';
      this.ambientOsc1.frequency.setValueAtTime(48, this.ctx.currentTime); // Low sub drone

      this.ambientOsc2.type = 'sine';
      this.ambientOsc2.frequency.setValueAtTime(72.5, this.ctx.currentTime); // Dissonant minor 2nd

      this.ambientFilter.type = 'lowpass';
      this.ambientFilter.frequency.setValueAtTime(140, this.ctx.currentTime);
      this.ambientFilter.Q.setValueAtTime(4, this.ctx.currentTime);

      const ambientDroneGain = this.ctx.createGain();
      ambientDroneGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      this.ambientOsc1.connect(this.ambientFilter);
      this.ambientOsc2.connect(this.ambientFilter);
      this.ambientFilter.connect(ambientDroneGain);
      ambientDroneGain.connect(this.musicGain);

      this.ambientOsc1.start();
      this.ambientOsc2.start();
      this.isAmbientPlaying = true;
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopAmbient() {
    if (this.ambientOsc1) {
      try { this.ambientOsc1.stop(); this.ambientOsc1.disconnect(); } catch {}
      this.ambientOsc1 = null;
    }
    if (this.ambientOsc2) {
      try { this.ambientOsc2.stop(); this.ambientOsc2.disconnect(); } catch {}
      this.ambientOsc2 = null;
    }
    this.isAmbientPlaying = false;
  }

  // Heartbeat intensity control (increases BPM & pitch when ghost is nearby)
  public updateHeartbeat(intensity: number) {
    // intensity: 0 to 1
    if (intensity <= 0.05) {
      if (this.heartbeatInterval !== null) {
        window.clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
      return;
    }

    const targetBpm = 60 + intensity * 100; // 60 to 160 bpm
    if (Math.abs(targetBpm - this.heartbeatBpm) > 10 || this.heartbeatInterval === null) {
      this.heartbeatBpm = targetBpm;
      if (this.heartbeatInterval !== null) {
        window.clearInterval(this.heartbeatInterval);
      }
      const intervalMs = (60 / targetBpm) * 1000;
      this.heartbeatInterval = window.setInterval(() => {
        this.playHeartbeatThump(intensity);
      }, intervalMs);
    }
  }

  public stopHeartbeat() {
    if (this.heartbeatInterval !== null) {
      window.clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private playHeartbeatThump(intensity: number) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(65 + intensity * 25, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.18);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, t);

    const volume = 0.3 + intensity * 0.5;
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.25);

    // Second softer thump (lub-dub)
    const t2 = t + 0.12;
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(55, t2);
    osc2.frequency.exponentialRampToValueAtTime(25, t2 + 0.15);

    gain2.gain.setValueAtTime(volume * 0.7, t2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.18);

    osc2.connect(filter);
    gain2.connect(this.sfxGain);
    osc2.start(t2);
    osc2.stop(t2 + 0.2);
  }

  // SFX: Footstep
  public playFootstep() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    // Subtle wood creak pitch variation
    const freq = 90 + Math.random() * 30;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, t);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  // SFX: Flashlight click
  public playFlashlightClick() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.03);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // SFX: Door creak / unlock
  public playDoor(isUnlocked: boolean) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    if (isUnlocked) {
      // Creaking wooden swing open
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.linearRampToValueAtTime(280, t + 0.25);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.5);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.6);
    } else {
      // Locked door handle rattle
      for (let i = 0; i < 2; i++) {
        const tOffset = t + i * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, tOffset);
        osc.frequency.exponentialRampToValueAtTime(90, tOffset + 0.06);

        gain.gain.setValueAtTime(0.22, tOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, tOffset + 0.07);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(tOffset);
        osc.stop(tOffset + 0.08);
      }
    }
  }

  // SFX: Key & item pickup chime
  public playItemPickup() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 music box
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.07);

      gain.gain.setValueAtTime(0.2, t + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t + idx * 0.07);
      osc.stop(t + idx * 0.07 + 0.5);
    });
  }

  // SFX: Puzzle solve / secret revealed
  public playPuzzleSolve() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const chords = [392.0, 493.88, 587.33, 783.99]; // G-B-D-G
    chords.forEach((freq) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 1.25);
    });
  }

  // SFX: Ghost screech / sudden scare
  public playJumpScare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    // Dissonant screech
    [320, 339.8, 620, 680, 890].forEach((freq) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.linearRampToValueAtTime(freq * 1.4, t + 0.4);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.85);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.9);
    });
  }

  // SFX: Cupboard hide enter/exit
  public playCupboardHide(entering: boolean) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(entering ? 240 : 180, t);
    osc.frequency.exponentialRampToValueAtTime(entering ? 110 : 260, t + 0.3);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  // SFX: Game Over death sound
  public playGameOverSound() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + 2.0);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(t);
    osc.stop(t + 2.3);
  }

  // SFX: Victory escape chords
  public playVictoryTheme() {
    this.initContext();
    if (!this.ctx || !this.musicGain || this.isMuted) return;

    const chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66], // G
      [261.63, 329.63, 392.00, 523.25] // C Major resolve
    ];

    chords.forEach((chord, chordIdx) => {
      const chordTime = this.ctx!.currentTime + chordIdx * 0.9;
      chord.forEach((freq) => {
        if (!this.ctx || !this.musicGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordTime);

        gain.gain.setValueAtTime(0.18, chordTime);
        gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 1.2);

        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(chordTime);
        osc.stop(chordTime + 1.3);
      });
    });
  }
}

export const soundEngine = new SoundEngine();
