export interface TourStep {
  id: string;
  target: string; // CSS selector or data-tour attribute
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  highlightPadding?: number;
}

export interface TourState {
  isActive: boolean;
  currentStep: number;
  isCompleted: boolean;
}
