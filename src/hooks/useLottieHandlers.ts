import { LottieEvent } from '../machines/lottieStateMachine';

interface UseLottieHandlersProps {
  send: (event: LottieEvent) => void;
}

export function useLottieHandlers({ send }: UseLottieHandlersProps) {
  const handleUpload = (file: File) => {
    send({ type: 'UPLOAD_FILE', file });
  };

  const handleExport = () => {
    send({ type: 'EXPORT' });
  };

  const handleReset = () => {
    send({ type: 'RESET' });
  };

  const handleRenderModeChange = (mode: 'svg' | 'canvas') => {
    send({ type: 'SWITCH_RENDER_MODE', mode });
  };

  const handleLayerSelect = (index: number | null) => {
    send({ type: 'SELECT_LAYER', layerIndex: index });
  };

  const handleToggleVisibility = (index: number) => {
    send({ type: 'TOGGLE_LAYER_VISIBILITY', layerIndex: index });
  };

  const handleToggleLock = (index: number) => {
    send({ type: 'TOGGLE_LAYER_LOCK', layerIndex: index });
  };

  const handlePlayPause = () => {
    send({ type: 'TOGGLE_PLAYBACK' });
  };

  const handleFrameChange = (frame: number) => {
    send({ type: 'SCRUB', frame });
  };

  const handleFrameUpdate = (frame: number) => {
    send({ type: 'UPDATE_FRAME', frame });
  };

  const handleSpeedChange = (newSpeed: number) => {
    send({ type: 'SET_SPEED', speed: newSpeed });
  };

  const handleLoopToggle = () => {
    send({ type: 'TOGGLE_LOOP' });
  };

  const handlePropertyChange = (layerIndex: number, property: string, value: any) => {
    send({ 
      type: 'UPDATE_LAYER_PROPERTY', 
      layerIndex, 
      property, 
      value 
    });
  };

  return {
    handleUpload,
    handleExport,
    handleReset,
    handleRenderModeChange,
    handleLayerSelect,
    handleToggleVisibility,
    handleToggleLock,
    handlePlayPause,
    handleFrameChange,
    handleFrameUpdate,
    handleSpeedChange,
    handleLoopToggle,
    handlePropertyChange,
  };
}
