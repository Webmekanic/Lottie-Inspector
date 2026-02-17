import { useRef } from 'react';
import { Upload, Download, RotateCcw, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { useUIStore } from '../../stores/uiStore';

interface TopNavBarProps {
  fileName: string;
  renderMode: 'svg' | 'canvas';
  onRenderModeChange: (mode: 'svg' | 'canvas') => void;
  fps: number;
  onUpload: (file: File) => void;
  onExport: () => void;
  onReset: () => void;
  hasAnimation: boolean;
}

export function TopNavBar({
  fileName,
  renderMode,
  onRenderModeChange,
  fps,
  onUpload,
  onExport,
  onReset,
  hasAnimation,
}: TopNavBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useUIStore();
  const isDarkMode = theme === 'dark';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="h-14 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <h1 className="font-semibold text-white">Lottie Inspector</h1>
        </div>
        <span className="text-gray-400 text-sm">{fileName || 'No file loaded'}</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload />
          Upload JSON
        </Button>
        <Button 
          variant="outline" 
          className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={onExport}
          disabled={!hasAnimation}
        >
          <Download />
          Export
        </Button>
        <Button 
          variant="ghost" 
          className="text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={onReset}
          disabled={!hasAnimation}
        >
          <RotateCcw />
          Reset
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-md">
          <span className={`text-xs ${renderMode === 'svg' ? 'text-white' : 'text-gray-500'}`}>SVG</span>
          <Switch
            checked={renderMode === 'canvas'}
            onCheckedChange={(checked) => onRenderModeChange(checked ? 'canvas' : 'svg')}
            disabled={!hasAnimation}
          />
          <span className={`text-xs ${renderMode === 'canvas' ? 'text-white' : 'text-gray-500'}`}>Canvas</span>
        </div>
        <Badge variant="outline" className="bg-gray-800 border-gray-700 text-gray-300">
          {fps.toFixed(1)} FPS
        </Badge>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
