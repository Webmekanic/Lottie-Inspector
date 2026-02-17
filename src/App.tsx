import { TopNavBar } from './app/components/TopNavBar';
import { LeftPanel } from './app/components/LeftPanel';
import { CenterPanel } from './app/components/CenterPanel';

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-950 text-white overflow-hidden">
        <TopNavBar
          fileName="example.json"
          renderMode="canvas"
          onRenderModeChange={(mode) => console.log('Render mode changed to:', mode)}
          fps={60}
          onUpload={(file) => console.log('File uploaded:', file)}
          onExport={() => console.log('Export triggered')}
          onReset={() => console.log('Reset triggered')}
          hasAnimation={true}
        />
        <div className="flex-1 flex overflow-hidden">
          <LeftPanel
            animation={null}
            selectedLayerIndex={null}
            onLayerSelect={(index) => console.log('Layer selected:', index)}
            onToggleVisibility={(index) => console.log('Toggle visibility for layer:', index)}
            onToggleLock={(index) => console.log('Toggle lock for layer:', index)}
          />

          <CenterPanel
            animation={null}
            renderMode="canvas"
            isPlaying={false}
            currentFrame={0}
            loop={false}
            onFrameChange={(frame) => console.log('Frame changed to:', frame)}
            speed={1}
            onSpeedChange={(speed) => console.log('Speed changed to:', speed)}
            totalFrames={0}
            selectedLayerIndex={null}
            onLoopToggle={() => console.log('Loop toggled')}
            onPlayPause={() => console.log('Play/Pause toggled')}
        />
        </div>
    </div>
  )
}

export default App