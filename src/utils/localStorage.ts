import { LottieAnimation } from '../types/lottie';

const STORAGE_KEY = 'lottie-inspector-state';

export interface PersistedState {
  originalAnimation: LottieAnimation | null;
  currentAnimation: LottieAnimation | null;
  speed: number;
  loop: boolean;
  renderMode: 'svg' | 'canvas';
}

export function saveToLocalStorage(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }
}

export function loadFromLocalStorage(): PersistedState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as PersistedState;
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
    return null;
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
}
