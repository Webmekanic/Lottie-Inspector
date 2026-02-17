import { TopNavBar } from './app/components/TopNavBar';

function App() {

  return (
    <div className="min-h-screen bg-gray-200">
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
    </div>
  )
}

export default App