import { useEffect } from 'react';
import { tourSteps } from '../utils/tourSteps';
import { create } from 'zustand';

const TOUR_STORAGE_KEY = 'lottie-inspector-tour-completed';

interface TourState {
  isActive: boolean;
  currentStep: number;
  isCompleted: boolean;
  startTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  resetTour: () => void;
}

const useTourStore = create<TourState>((set, get) => ({
  isActive: false,
  currentStep: 0,
  isCompleted: false,

  startTour: () => {
    set({ isActive: true, currentStep: 0 });
  },

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < tourSteps.length - 1) {
      set({ currentStep: currentStep + 1 });
    } else {
      get().completeTour();
    }
  },

  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  skipTour: () => {
    get().completeTour();
  },

  completeTour: () => {
    set({ isActive: false, isCompleted: true });
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(TOUR_STORAGE_KEY, 'true');
      } catch (error) {
        console.error('Failed to persist tour completion state to localStorage:', error);
      }
    }
  },

  resetTour: () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(TOUR_STORAGE_KEY);
      } catch (error) {
        console.warn('Failed to remove tour completion state from localStorage:', error);
      }
    }
    set({ isCompleted: false, currentStep: 0 });
  },
}));

let hasInitializedFromStorage = false;

export function useTour() {
  const {
    isActive,
    currentStep,
    isCompleted,
    startTour,
    nextStep,
    previousStep,
    skipTour,
    resetTour,
  } = useTourStore();

  useEffect(() => {
    if (hasInitializedFromStorage) {
      return;
    }
    hasInitializedFromStorage = true;

    let completed = false;
    try {
      completed = localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
    } catch {
      completed = false;
    }

    if (completed) {
      useTourStore.setState({ isCompleted: true });
      return;
    }

    // Auto-start tour for first-time users after a short delay
    const timer = setTimeout(() => {
      useTourStore.setState({ isActive: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return {
    isActive,
    currentStep,
    isCompleted,
    totalSteps: tourSteps.length,
    currentStepData: tourSteps[currentStep],
    startTour,
    nextStep,
    previousStep,
    skipTour,
    resetTour,
  };
}
