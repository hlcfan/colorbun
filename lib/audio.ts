import { Howl } from 'howler';

// In a real app, these would be paths to actual mp3/wav files
// For now, we'll use empty sounds or placeholders if available, 
// but code the infrastructure so it's ready.

const SOUNDS = {
  tap: '/assets/sounds/tap.mp3',
  brush: '/assets/sounds/brush.mp3',
  fill: '/assets/sounds/pop.mp3',
  success: '/assets/sounds/success.mp3',
};

class AudioManager {
  private sounds: Record<string, Howl> = {};
  private muted: boolean = false;

  constructor() {
    // Initialize sounds
    if (typeof window !== 'undefined') {
      Object.entries(SOUNDS).forEach(([key, src]) => {
        this.sounds[key] = new Howl({
          src: [src],
          volume: 0.5,
          preload: true,
        });
      });
    }
  }

  play(key: keyof typeof SOUNDS) {
    if (this.muted) return;
    const sound = this.sounds[key];
    if (sound) {
      sound.play();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    Howler.mute(this.muted);
    return this.muted;
  }
}

export const audio = new AudioManager();
