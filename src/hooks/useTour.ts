import { useState, useEffect, useCallback } from 'react';
import { tourSteps } from '../utils/tourSteps';

const TOUR_STORAGE_KEY = 'lottie-inspector-tour-completed';

export function useTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_STORAGE_KEY) === 'true';
    setIsCompleted(completed);
    
    // Auto-start tour for first-time users after a short delay
    if (!completed) {
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const skipTour = useCallback(() => {
    completeTour();
  }, []);

  const completeTour = useCallback(() => {
    setIsActive(false);
    setIsCompleted(true);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
  }, []);

  const resetTour = useCallback(() => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setIsCompleted(false);
    setCurrentStep(0);
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
