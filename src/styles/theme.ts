export const theme = {
  colors: {
    // Grayscale
    gray950: '#0a0a0d',
    gray900: '#18181b',
    gray800: '#27272a',
    gray700: '#3f3f46',
    gray600: '#52525b',
    gray500: '#71717a',
    gray400: '#a1a1aa',
    gray300: '#d4d4d8',
    gray200: '#e4e4e7',
    gray100: '#f4f4f5',
    
    // Primary colors
    white: '#ffffff',
    black: '#000000',
    
    // Blue
    blue400: '#60a5fa',
    blue500: '#3b82f6',
    blue600: '#2563eb',
    
    // Green
    green400: '#4ade80',
    green500: '#22c55e',
    
    // Red
    red400: '#f87171',
    red500: '#ef4444',
    red600: '#dc2626',
    
    // Amber/Yellow
    amber400: '#fbbf24',
    amber500: '#f59e0b',
    
    // Purple
    purple400: '#c084fc',
    purple500: '#a855f7',
    
    // Transparency levels
    transparent: 'transparent',
  },
  
  typography: {
    fontFamily: {
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',    // 2px
    1: '0.25rem',       // 4px
    1.5: '0.375rem',    // 6px
    2: '0.5rem',        // 8px
    2.5: '0.625rem',    // 10px
    3: '0.75rem',       // 12px
    4: '1rem',          // 16px
    5: '1.25rem',       // 20px
    6: '1.5rem',        // 24px
    7: '1.75rem',       // 28px
    8: '2rem',          // 32px
    9: '2.25rem',       // 36px
    10: '2.5rem',       // 40px
    12: '3rem',         // 48px
    16: '4rem',         // 64px
    20: '5rem',         // 80px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',     // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',     // 6px
    lg: '0.5rem',       // 8px
    xl: '0.75rem',      // 12px
    '2xl': '1rem',      // 16px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    DEFAULT: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
  },
};

export type Theme = typeof theme;
