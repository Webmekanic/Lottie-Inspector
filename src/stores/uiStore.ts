import { create } from 'zustand';

interface UIState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Panel collapse states
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Zoom
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  
  // Timeline zoom
  timelineZoom: number;
  setTimelineZoom: (zoom: number) => void;
  
  // FPS display
  currentFPS: number;
  setCurrentFPS: (fps: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Theme
  theme: 'dark',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),
  
  // Panel collapse
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
  toggleLeftPanel: () => set((state) => ({ 
    leftPanelCollapsed: !state.leftPanelCollapsed 
  })),
  toggleRightPanel: () => set((state) => ({ 
    rightPanelCollapsed: !state.rightPanelCollapsed 
  })),
  
  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Zoom
  zoomLevel: 40,
  setZoomLevel: (level) => set({ zoomLevel: Math.max(10, Math.min(500, level)) }),
  zoomIn: () => set((state) => ({ 
    zoomLevel: Math.min(500, state.zoomLevel + 10) 
  })),
  zoomOut: () => set((state) => ({ 
    zoomLevel: Math.max(10, state.zoomLevel - 10) 
  })),
  
  // Timeline zoom
  timelineZoom: 1,
  setTimelineZoom: (zoom) => set({ timelineZoom: Math.max(0.1, Math.min(5, zoom)) }),
  
  // FPS
  currentFPS: 0,
  setCurrentFPS: (fps) => set({ currentFPS: fps }),
}));
