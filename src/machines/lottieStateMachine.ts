import { setup, assign, fromPromise } from 'xstate';
import { LottieAnimation, LottieLayer, RenderMode } from '../types/lottie';
import { loadFromLocalStorage, clearLocalStorage } from '../utils/localStorage';

export interface LottieContext {
  originalAnimation: LottieAnimation | null;
  currentAnimation: LottieAnimation | null;
  selectedLayerIndex: number | null;
  selectedLayer: LottieLayer | null;
  isPlaying: boolean;
  currentFrame: number;
  speed: number;
  loop: boolean;
  renderMode: RenderMode;
  error: string | null;
}

export type LottieEvent =
  | { type: 'UPLOAD_FILE'; file: File }
  | { type: 'SELECT_LAYER'; layerIndex: number | null }
  | { type: 'UPDATE_LAYER_PROPERTY'; layerIndex: number; property: string; value: any }
  | { type: 'TOGGLE_LAYER_VISIBILITY'; layerIndex: number }
  | { type: 'TOGGLE_LAYER_LOCK'; layerIndex: number }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_PLAYBACK' }
  | { type: 'SCRUB'; frame: number }
  | { type: 'UPDATE_FRAME'; frame: number }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'TOGGLE_LOOP' }
  | { type: 'SWITCH_RENDER_MODE'; mode: RenderMode }
  | { type: 'EXPORT' }
  | { type: 'RESET' };

const parseFile = fromPromise(async ({ input }: { input: { file: File } }): Promise<LottieAnimation> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        resolve(json);
      } catch (err) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(input.file);
  });
});

/**
 * Recursively clean lottie-web internal properties from animation data
 */
function cleanLottieData(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanLottieData);
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};
    
    for (const key in obj) {
      // Skip lottie-web internal properties
      if (key === '_render' || key === 'completed' || key === '__complete') {
        continue;
      }
      
      cleaned[key] = cleanLottieData(obj[key]);
    }
    
    return cleaned;
  }

  return obj;
}

const exportFile = fromPromise(async ({ input }: { input: { animation: LottieAnimation } }): Promise<void> => {
  // Clean the animation data by removing lottie-web internal properties
  const cleanedAnimation = cleanLottieData(input.animation);
  
  const dataStr = JSON.stringify(cleanedAnimation, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `lottie-edited-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
});

// Load persisted state from localStorage
const persistedState = loadFromLocalStorage();

export const lottieStateMachine = setup({
  types: {
    context: {} as LottieContext,
    events: {} as LottieEvent,
  },
  actors: {
    parseFile,
    exportFile,
  },
}).createMachine({
  id: 'lottieInspector',
  initial: persistedState?.currentAnimation ? 'ready' : 'idle',
  context: {
    originalAnimation: persistedState?.originalAnimation ?? null,
    currentAnimation: persistedState?.currentAnimation ?? null,
    selectedLayerIndex: null,
    selectedLayer: null,
    isPlaying: false,
    currentFrame: 0,
    speed: persistedState?.speed ?? 1,
    loop: persistedState?.loop ?? true,
    renderMode: persistedState?.renderMode ?? 'svg',
    error: null,
  },
  states: {
    idle: {
      on: {
        UPLOAD_FILE: 'parsing',
      },
    },
    parsing: {
      invoke: {
        src: 'parseFile',
        input: ({ event }) => ({ file: (event as any).file }),
        onDone: {
          target: 'ready',
          actions: assign({
            originalAnimation: ({ event }) => event.output,
            currentAnimation: ({ event }) => JSON.parse(JSON.stringify(event.output)),
            error: null,
            currentFrame: 0,
            selectedLayerIndex: null,
            selectedLayer: null,
          }),
        },
        onError: {
          target: 'error',
          actions: assign({
            error: ({ event }) => {
              const error = event.error as Error;
              return error?.message || 'Failed to parse file';
            },
          }),
        },
      },
    },
    ready: {
      on: {
        SELECT_LAYER: {
          actions: assign({
            selectedLayerIndex: ({ event }) => event.layerIndex,
            selectedLayer: ({ context, event }) => {
              if (event.layerIndex === null || !context.currentAnimation) {
                return null;
              }
              return context.currentAnimation.layers[event.layerIndex] || null;
            },
          }),
        },
        UPDATE_LAYER_PROPERTY: {
          actions: assign({
            currentAnimation: ({ context, event }) => {
              if (!context.currentAnimation) return null;
              
              const newAnimation = JSON.parse(JSON.stringify(context.currentAnimation));
              const layer = newAnimation.layers[event.layerIndex];
              
              if (!layer) return newAnimation;
              
              const keys = event.property.split('.');
              let target: any = layer;
              
              for (let i = 0; i < keys.length - 1; i++) {
                if (!target[keys[i]]) {
                  target[keys[i]] = {};
                }
                target = target[keys[i]];
              }
              
              target[keys[keys.length - 1]] = event.value;
              
              return newAnimation;
            },
            selectedLayer: ({ context, event }) => {
              if (context.selectedLayerIndex !== event.layerIndex || !context.currentAnimation) {
                return context.selectedLayer;
              }
              
              const newAnimation = JSON.parse(JSON.stringify(context.currentAnimation));
              const layer = newAnimation.layers[event.layerIndex];
              
              if (!layer) return context.selectedLayer;
              
              const keys = event.property.split('.');
              let target: any = layer;
              
              for (let i = 0; i < keys.length - 1; i++) {
                if (!target[keys[i]]) {
                  target[keys[i]] = {};
                }
                target = target[keys[i]];
              }
              
              target[keys[keys.length - 1]] = event.value;
              
              return layer;
            },
          }),
        },
        TOGGLE_LAYER_VISIBILITY: {
          actions: assign({
            currentAnimation: ({ context, event }) => {
              if (!context.currentAnimation) return null;
              
              const newAnimation = JSON.parse(JSON.stringify(context.currentAnimation));
              const layer = newAnimation.layers[event.layerIndex];
              
              if (layer) {
                // Toggle hidden property: hd=true means hidden, hd=false/undefined means visible
                layer.hd = !layer.hd;
              }
              
              return newAnimation;
            },
            selectedLayer: ({ context, event }) => {
              if (context.selectedLayerIndex !== event.layerIndex || !context.currentAnimation) {
                return context.selectedLayer;
              }
              
              const newAnimation = JSON.parse(JSON.stringify(context.currentAnimation));
              const layer = newAnimation.layers[event.layerIndex];
              
              if (layer) {
                layer.hd = !layer.hd;
              }
              
              return layer;
            },
          }),
        },
        TOGGLE_LAYER_LOCK: {
          actions: assign({
            currentAnimation: ({ context, event }) => {
              if (!context.currentAnimation) return null;
              
              const newAnimation = JSON.parse(JSON.stringify(context.currentAnimation));
              const layer = newAnimation.layers[event.layerIndex];
              
              if (layer) {
                layer.locked = !layer.locked;
              }
              
              return newAnimation;
            },
            selectedLayer: ({ context, event }) => {
              if (context.selectedLayerIndex !== event.layerIndex || !context.currentAnimation) {
                return context.selectedLayer;
              }
              
              const newAnimation = JSON.parse(JSON.stringify(context.currentAnimation));
              const updatedLayer = newAnimation.layers[event.layerIndex];
              
              if (updatedLayer) {
                updatedLayer.locked = !updatedLayer.locked;
              }
              
              return updatedLayer;
            },
          }),
        },
        PLAY: {
          actions: assign({ isPlaying: true }),
        },
        PAUSE: {
          actions: assign({ isPlaying: false }),
        },
        TOGGLE_PLAYBACK: {
          actions: assign({ isPlaying: ({ context }) => !context.isPlaying }),
        },
        SCRUB: {
          actions: assign({
            currentFrame: ({ event }) => event.frame,
            isPlaying: false,
          }),
        },
        UPDATE_FRAME: {
          actions: assign({
            currentFrame: ({ event }) => event.frame,
          }),
        },
        SET_SPEED: {
          actions: assign({ speed: ({ event }) => event.speed }),
        },
        TOGGLE_LOOP: {
          actions: assign({ loop: ({ context }) => !context.loop }),
        },
        SWITCH_RENDER_MODE: {
          actions: assign({ renderMode: ({ event }) => event.mode }),
        },
        EXPORT: 'exporting',
        RESET: {
          actions: [
            assign({
              currentAnimation: ({ context }) =>
                context.originalAnimation
                  ? JSON.parse(JSON.stringify(context.originalAnimation))
                  : null,
              selectedLayerIndex: null,
              selectedLayer: null,
              currentFrame: 0,
              isPlaying: false,
            }),
            () => clearLocalStorage(),
          ],
        },
        UPLOAD_FILE: 'parsing',
      },
    },
    exporting: {
      invoke: {
        src: 'exportFile',
        input: ({ context }) => ({ animation: context.currentAnimation! }),
        onDone: 'ready',
        onError: 'ready',
      },
    },
    error: {
      on: {
        UPLOAD_FILE: 'parsing',
      },
    },
  },
});
