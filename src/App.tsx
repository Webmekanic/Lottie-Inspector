import { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import { useUIStore } from './stores/uiStore';
import { saveToLocalStorage } from './utils/localStorage';
import { isMacOS } from './utils/platform';
import { ErrorState } from './app/components/ErrorState';
import { TopNavBar } from './app/components/TopNavBar';
import { LeftPanel } from './app/components/LeftPanel';
import { CenterPanel } from './app/components/CenterPanel';
import { RightPanel } from './app/components/RightPanel';
import { BottomTimeline } from './app/components/BottomTimeLine';
import { Tour } from './components/Tour/Tour';
import { useLottieHandlers } from './hooks/useLottieHandlers';
import { lottieStateMachine } from './machines/lottieStateMachine';
import { AppContainer, MainContent, MobileOverlay, MobileOverlayTitle, MobileOverlayText } from './styles/UiStyles';

function App() {
  const [state, send] = useMachine(lottieStateMachine);
  const { theme, currentFPS } = useUIStore();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  useEffect(() => {
    if (currentAnimation) {
      saveToLocalStorage({
        originalAnimation: state.context.originalAnimation,
        currentAnimation,
        speed,
        loop,
        renderMode,
      });
    }
  }, [currentAnimation, state.context.originalAnimation, speed, loop, renderMode]);

  const handlers = useLottieHandlers({ send });
  const canUndo = state.context.historyPast.length > 0;
  const canRedo = state.context.historyFuture.length > 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const modKey = isMacOS() ? e.metaKey : e.ctrlKey;

      if (modKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) handlers.handleRedo();
        } else {
          if (canUndo) handlers.handleUndo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, handlers]);

    if (state.matches('error')) {
    return (
      <ErrorState 
        error={error} 
        onFileUpload={handlers.handleUpload} 
      />
    );
  }

  return (
    <AppContainer data-tour="app-container">
      {windowWidth < 1024 && (
        <MobileOverlay>
          <MobileOverlayTitle>Works Best on Desktop</MobileOverlayTitle>
          <MobileOverlayText>
            Switch to a desktop with a viewing width of at least 1024px to enjoy a better experience
          </MobileOverlayText>
        </MobileOverlay>
      )}
      <Tour />
      <TopNavBar
        fileName={fileName}
        renderMode={renderMode}
        onRenderModeChange={handlers.handleRenderModeChange}
        fps={currentFPS}
        onUpload={handlers.handleUpload}
        onExport={handlers.handleExport}
        onReset={handlers.handleReset}
        hasAnimation={currentAnimation !== null}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handlers.handleUndo}
        onRedo={handlers.handleRedo}
      />
      <MainContent>
        <LeftPanel
          animation={currentAnimation}
          selectedLayerIndex={selectedLayerIndex}
          selectedLayer={selectedLayer}
          onLayerSelect={handlers.handleLayerSelect}
          onToggleVisibility={handlers.handleToggleVisibility}
          onToggleLock={handlers.handleToggleLock}
          onSend={send}
        />
        <CenterPanel
          animation={currentAnimation}
          isPlaying={isPlaying}
          onPlayPause={handlers.handlePlayPause}
          currentFrame={currentFrame}
          totalFrames={totalFrames}
          onFrameChange={handlers.handleFrameChange}
          onFrameUpdate={handlers.handleFrameUpdate}
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
          animation={currentAnimation}
          onSend={send}
        />
      </MainContent>
      <BottomTimeline
        animation={currentAnimation}
        currentFrame={currentFrame}
        totalFrames={totalFrames}
        onFrameChange={handlers.handleFrameChange}
        selectedLayerIndex={selectedLayerIndex} 
        isPlaying={isPlaying}   
        onLayerSelect={handlers.handleLayerSelect}
      />
    </AppContainer>
  )
}

export default App