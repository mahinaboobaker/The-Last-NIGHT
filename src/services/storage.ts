import { GameSaveData } from '../types/game';

const SAVE_KEY = 'the_last_night_hostel_save';
const SETTINGS_KEY = 'the_last_night_hostel_settings';
const ACHIEVEMENTS_KEY = 'the_last_night_hostel_achievements';

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  flashlightFlickerIntensity: number;
  retroScanlines: boolean;
}

export const defaultSettings: GameSettings = {
  masterVolume: 0.8,
  musicVolume: 0.6,
  sfxVolume: 0.9,
  isMuted: false,
  flashlightFlickerIntensity: 1.0,
  retroScanlines: true,
};

export const storageService = {
  saveGame(data: GameSaveData): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save game state to localStorage', e);
    }
  },

  loadGame(): GameSaveData | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as GameSaveData;
    } catch (e) {
      console.warn('Failed to load game state from localStorage', e);
      return null;
    }
  },

  hasSave(): boolean {
    return Boolean(localStorage.getItem(SAVE_KEY));
  },

  clearSave(): void {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {}
  },

  saveSettings(settings: GameSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  },

  loadSettings(): GameSettings {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return defaultSettings;
      return { ...defaultSettings, ...JSON.parse(raw) };
    } catch {
      return defaultSettings;
    }
  },

  unlockAchievement(id: string): void {
    try {
      const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(list));
      }
    } catch {}
  },

  getAchievements(): string[] {
    try {
      const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
};
