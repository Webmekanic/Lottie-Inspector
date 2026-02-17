import { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { useUIStore } from './stores/uiStore';
import { ErrorState } from './app/components/ErrorState';
import { TopNavBar } from './app/components/TopNavBar';
import { LeftPanel } from './app/components/LeftPanel';
import { CenterPanel } from './app/components/CenterPanel';
import { RightPanel } from './app/components/RightPanel';
import { BottomTimeline } from './app/components/BottomTimeLine';
import { useLottieHandlers } from './hooks/useLottieHandlers';
import { lottieStateMachine } from './machines/lottieStateMachine';

function App() {
  const [state, send] = useMachine(lottieStateMachine);
  const { theme, currentFPS } = useUIStore();

    const {
    currentAnimation,
    selectedLayerIndex,
    selectedLayer,
    isPlaying,
    currentFrame,
    speed,
    loop,
    renderMode,
    error,
  } = state.context;

  const totalFrames = currentAnimation?.op || 0;
  const fileName = currentAnimation?.nm || '';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handlers = useLottieHandlers({ send });

    if (state.matches('error')) {
    return (
      <ErrorState 
        error={error} 
        onFileUpload={handlers.handleUpload} 
      />
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-950 text-white overflow-hidden">
      <TopNavBar
        fileName={fileName}
        renderMode={renderMode}
        onRenderModeChange={handlers.handleRenderModeChange}
        fps={currentFPS}
        onUpload={handlers.handleUpload}
        onExport={handlers.handleExport}
        onReset={handlers.handleReset}
        hasAnimation={currentAnimation !== null}
      />
      <div className="flex-1 flex overflow-hidden">
        <LeftPanel
          animation={currentAnimation}
          selectedLayerIndex={selectedLayerIndex}
          onLayerSelect={handlers.handleLayerSelect}
          onToggleVisibility={handlers.handleToggleVisibility}
          onToggleLock={handlers.handleToggleLock}
        />
        <CenterPanel
          animation={currentAnimation}
          isPlaying={isPlaying}
          onPlayPause={handlers.handlePlayPause}
          currentFrame={currentFrame}
          totalFrames={totalFrames}
          onFrameChange={handlers.handleFrameChange}
          speed={speed}
          onSpeedChange={handlers.handleSpeedChange}
          loop={loop}
          onLoopToggle={handlers.handleLoopToggle}
          renderMode={renderMode}
          selectedLayerIndex={selectedLayerIndex}
        />
        <RightPanel
          selectedLayer={selectedLayer}
          selectedLayerIndex={selectedLayerIndex}
          onPropertyChange={handlers.handlePropertyChange}
        />
      </div>
      <BottomTimeline
        animation={currentAnimation}
        currentFrame={currentFrame}
        totalFrames={totalFrames}
        onFrameChange={handlers.handleFrameChange}
        selectedLayer={selectedLayer}
      />
    </div>
  )
}

export default App