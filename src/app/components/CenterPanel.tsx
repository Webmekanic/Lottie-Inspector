import { Play, Pause, ZoomIn, ZoomOut, Repeat } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { LottieAnimation, RenderMode } from '../../types/lottie';
import { useUIStore } from '../../stores/uiStore';
import { usePlaybackTicker } from '../../hooks/usePlaybackTicker';

interface CenterPanelProps {
  animation: LottieAnimation | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  currentFrame: number;
  totalFrames: number;
  onFrameChange: (frame: number) => void;
  onFrameUpdate?: (frame: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  loop: boolean;
  onLoopToggle: () => void;
  renderMode: RenderMode;
  selectedLayerIndex: number | null;
}

export function CenterPanel({
  animation,
  isPlaying,
  onPlayPause,
  currentFrame,
  totalFrames,
  onFrameChange,
  onFrameUpdate,
  speed,
  onSpeedChange,
  loop,
  onLoopToggle,
  renderMode,
  selectedLayerIndex,
}: CenterPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const { zoomLevel, zoomIn, zoomOut, setCurrentFPS } = useUIStore();
  const lastFrameTimeRef = useRef<number>(Date.now());
  const frameCountRef = useRef<number>(0);

  // Use playback ticker hook to sync frames during playback
  usePlaybackTicker({
    animationRef,
    isPlaying,
    onFrameUpdate: onFrameUpdate || (() => {}),
  });

  useEffect(() => {
    if (!animation || !containerRef.current) return;

    if (animationRef.current) {
      animationRef.current.destroy();
      animationRef.current = null;
    }

    try {
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: renderMode,
        loop: false,
        autoplay: false,
        animationData: animation,
      });

      animationRef.current.goToAndStop(currentFrame, true);

      // Calculate FPS
      const handleFPSFrame = () => {
        frameCountRef.current++;
        const now = Date.now();
        const elapsed = now - lastFrameTimeRef.current;
        
        if (elapsed >= 1000) {
          const fps = (frameCountRef.current * 1000) / elapsed;
          setCurrentFPS(fps);
          frameCountRef.current = 0;
          lastFrameTimeRef.current = now;
        }
      };

      animationRef.current.addEventListener('enterFrame', handleFPSFrame);
    } catch (error) {
      console.error('Failed to load Lottie animation:', error);
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [animation, renderMode]);

  useEffect(() => {
    if (!animationRef.current) return;

    if (isPlaying) {
      animationRef.current.play();
    } else {
      animationRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!animationRef.current) return;
    animationRef.current.setSpeed(speed);
  }, [speed]);

  useEffect(() => {
    if (!animationRef.current || isPlaying) return;
    animationRef.current.goToAndStop(currentFrame, true);
  }, [currentFrame, isPlaying]);

  useEffect(() => {
    if (!animationRef.current) return;

    const handleComplete = () => {
      if (loop) {
        animationRef.current?.goToAndPlay(0);
      } else {
        onFrameChange(0);
      }
    };

    animationRef.current.addEventListener('complete', handleComplete);

    return () => {
      try {
        animationRef.current?.removeEventListener('complete', handleComplete);
      } catch (error) {
        // Animation was already destroyed, ignore error
      }
    };
  }, [loop, onFrameChange]);

  const animationWidth = animation?.w || 400;
  const animationHeight = animation?.h || 400;
  const scaledWidth = (animationWidth * zoomLevel) / 100;
  const scaledHeight = (animationHeight * zoomLevel) / 100;

  return (
    <div className="flex-1 bg-gray-950 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        {!animation ? (
          <div className="text-gray-500 text-center">
            <p className="text-lg mb-2">No animation loaded</p>
            <p className="text-sm">Upload a Lottie JSON file to get started</p>
          </div>
        ) : (
          <div 
            className="relative rounded-lg border border-gray-800 shadow-2xl overflow-hidden"
            style={{ 
              width: `${scaledWidth}px`, 
              height: `${scaledHeight}px`,
              backgroundImage: `
                linear-gradient(45deg, #1f2937 25%, transparent 25%),
                linear-gradient(-45deg, #1f2937 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #1f2937 75%),
                linear-gradient(-45deg, transparent 75%, #1f2937 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }}
          >
            <div 
              ref={containerRef} 
              className="absolute inset-0"
              style={{ 
                width: '100%', 
                height: '100%' 
              }}
            />
            {selectedLayerIndex !== null && (
              <div className="absolute inset-0 border-2 border-blue-500 pointer-events-none">
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <Button
            size="sm"
            onClick={onPlayPause}
            disabled={!animation}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <span className="text-xs text-gray-400 font-mono min-w-[100px]">
            Frame {currentFrame} / {totalFrames}
          </span>
          <div className="flex-1">
            <Slider
              value={[currentFrame]}
              onValueChange={(value) => onFrameChange(value[0])}
              max={totalFrames}
              step={1}
              disabled={!animation}
              className="w-full"
            />
          </div>
          <Select 
            value={speed.toString()} 
            onValueChange={(value) => onSpeedChange(parseFloat(value))}
            disabled={!animation}
          >
            <SelectTrigger className="w-[80px] h-8 bg-gray-800 border-gray-700 text-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="0.25">0.25x</SelectItem>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant={loop ? 'default' : 'outline'}
            onClick={onLoopToggle}
            disabled={!animation}
            className={loop ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white'}
          >
            <Repeat className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={zoomOut}
              disabled={!animation}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-gray-400 font-mono min-w-[45px] text-center">
              {zoomLevel}%
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={zoomIn}
              disabled={!animation}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}