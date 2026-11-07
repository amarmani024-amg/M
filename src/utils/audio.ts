/**
 * WebAudio sound synthesizer for The Mind Vault.
 * Completely client-side, zero external audio assets, works instantly on mobile touch.
 * Activated only upon the first user interaction.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check initial mute preference from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mind_vault_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mind_vault_muted', String(muted));
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Crisp, tactile button click sound
   */
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Audio safety
    }
  }

  /**
   * Memory matrix tile chime (frequency in Hz)
   */
  public playTile(freq: number) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Audio safety
    }
  }

  /**
   * Celebratory win chord arpeggio
   */
  public playWin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      // C5, E5, G5, C6 arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + i * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.46);
      });
    } catch {
      // Audio safety
    }
  }

  /**
   * Resonant mechanical vault unlock sound
   */
  public playUnlock() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Sub-bass mechanical rumble
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(90, now);
      subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.6);
      subGain.gain.setValueAtTime(0.3, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.62);

      // Metallic tumbler clicks
      [0.05, 0.18, 0.32].forEach((delay) => {
        if (!this.ctx) return;
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(1400, now + delay);
        clickOsc.frequency.exponentialRampToValueAtTime(450, now + delay + 0.05);
        clickGain.gain.setValueAtTime(0.08, now + delay);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.start(now + delay);
        clickOsc.stop(now + delay + 0.06);
      });

      // Bright resonant chime on completion
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(880, now + 0.4);
      bellGain.gain.setValueAtTime(0.2, now + 0.4);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      bellOsc.connect(bellGain);
      bellGain.connect(this.ctx.destination);
      bellOsc.start(now + 0.4);
      bellOsc.stop(now + 1.22);
    } catch {
      // Audio safety
    }
  }

  /**
   * Secret Easter Egg chime
   */
  public playEasterEgg() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const freqs = [659.25, 830.61, 987.77, 1318.51];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.32);
      });
    } catch {
      // Audio safety
    }
  }

  /**
   * Logic gate toggle blip
   */
  public playSwitch(state: boolean) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const freq = state ? 620 : 440;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.05);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Audio safety
    }
  }
}

export const sound = new SoundEngine();

/**
 * Mobile vibration trigger with graceful degradation
 */
export function triggerVibration(pattern: number | number[] = [40, 40, 80]) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Vibration not supported or allowed in this frame
  }
}
