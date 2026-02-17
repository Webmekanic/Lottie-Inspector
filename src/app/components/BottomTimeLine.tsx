import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';
import { LottieAnimation, LottieLayer } from '../../types/lottie';
import { useUIStore } from '../../stores/uiStore';
import { useMemo } from 'react';

interface BottomTimelineProps {
  animation: LottieAnimation | null;
  currentFrame: number;
  totalFrames: number;
  onFrameChange: (frame: number) => void;
  selectedLayer: LottieLayer | null;
}

export function BottomTimeline({ 
  animation,
  currentFrame, 
  totalFrames, 
  onFrameChange,
  selectedLayer 
}: BottomTimelineProps) {
  const { timelineZoom, setTimelineZoom } = useUIStore();

  const keyframes = useMemo(() => {
    if (!selectedLayer) return [];
    
    const frames: number[] = [];
    const extractFrames = (prop: any) => {
      if (prop && prop.a === 1 && Array.isArray(prop.k)) {
        prop.k.forEach((kf: any) => {
          if (typeof kf.t === 'number' && !frames.includes(kf.t)) {
            frames.push(kf.t);
          }
        });
      }
    };

    if (selectedLayer.ks) {
      extractFrames(selectedLayer.ks.p);
      extractFrames(selectedLayer.ks.s);
      extractFrames(selectedLayer.ks.r);
      extractFrames(selectedLayer.ks.o);
    }

    return frames.sort((a, b) => a - b);
  }, [selectedLayer]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const frame = Math.round(percent * totalFrames);
    onFrameChange(Math.max(0, Math.min(totalFrames, frame)));
  };

  const rulerInterval = totalFrames > 200 ? 20 : totalFrames > 100 ? 10 : 5;
  const rulerMarks = useMemo(() => {
    const marks = [];
    for (let i = 0; i <= totalFrames; i += rulerInterval) {
      marks.push(i);
    }
    return marks;
  }, [totalFrames, rulerInterval]);

  if (!animation) {
    return (
      <div className="h-[100px] bg-gray-900 border-t border-gray-800 flex items-center justify-center">
        <span className="text-gray-500 text-sm">No animation loaded</span>
      </div>
    );
  }

  return (
    <div className="h-[100px] bg-gray-900 border-t border-gray-800">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
          <span className="text-xs text-gray-400 font-semibold uppercase">Timeline</span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-gray-800 h-6 px-2"
              onClick={() => setTimelineZoom(Math.max(0.1, timelineZoom - 0.2))}
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
            <span className="text-xs text-gray-400 font-mono w-12 text-center">
              {(timelineZoom * 100).toFixed(0)}%
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-gray-800 h-6 px-2"
              onClick={() => setTimelineZoom(Math.min(5, timelineZoom + 0.2))}
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="flex-1 relative overflow-x-auto">
          <div 
            className="absolute inset-0" 
            style={{ minWidth: `${timelineZoom * 100}%` }}
          >
            <div className="h-6 border-b border-gray-800 flex items-end px-4 relative">
              {rulerMarks.map((frame) => (
                <div
                  key={frame}
                  className="absolute flex flex-col items-center"
                  style={{ left: `calc(${(frame / totalFrames) * 100}%)` }}
                >
                  <span className="text-[10px] text-gray-500 font-mono mb-1">{frame}</span>
                  <div className="w-px h-2 bg-gray-700" />
                </div>
              ))}
            </div>
            <div className="h-[calc(100%-24px)] px-4 pt-2 relative">
              {keyframes.map((frame) => (
                <div
                  key={frame}
                  className="absolute top-2 w-2 h-2 bg-blue-500 rounded-sm transform -translate-x-1/2 z-20"
                  style={{ left: `${(frame / totalFrames) * 100}%` }}
                  title={`Keyframe at ${frame}`}
                />
              ))}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-30"
                style={{ left: `${(currentFrame / totalFrames) * 100}%` }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-lg" />
              </div>
              <div 
                className="h-6 bg-gray-800/50 rounded cursor-pointer relative hover:bg-gray-800/70 transition-colors"
                onClick={handleTimelineClick}
              >
                <div 
                  className="absolute inset-y-0 left-0 bg-blue-600/30 rounded-l"
                  style={{ width: `${(currentFrame / totalFrames) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
