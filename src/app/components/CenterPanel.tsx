import { Play, Pause, ZoomIn, ZoomOut, Repeat } from 'lucide-react';
import { Slider } from './ui/slider';
import { Select, SelectItem, SelectValue } from './ui/select';
import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { LottieAnimation, RenderMode } from '../../types/lottie';
import { useUIStore } from '../../stores/uiStore';
import { usePlaybackTicker } from '../../hooks/usePlaybackTicker';
import * as S from '../../styles/CenterPanelStyles';

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
    <S.PanelContainer data-tour="center-panel">
      <S.ViewportArea>
        {!animation ? (
          <S.EmptyState>
            <S.EmptyTitle>No animation loaded</S.EmptyTitle>
            <S.EmptySubtitle>Upload a Lottie JSON file to get started</S.EmptySubtitle>
          </S.EmptyState>
        ) : (
          <S.CanvasWrapper $width={scaledWidth} $height={scaledHeight}>
            <S.LottieContainer ref={containerRef} />
            {selectedLayerIndex !== null && (
              <S.SelectionOverlay>
                <S.SelectionCorner $position="tl" />
                <S.SelectionCorner $position="tr" />
                <S.SelectionCorner $position="bl" />
                <S.SelectionCorner $position="br" />
              </S.SelectionOverlay>
            )}
          </S.CanvasWrapper>
        )}
      </S.ViewportArea>
      <S.ControlsBar>
        <S.ControlsInner>
          <S.ControlButton
            $variant="primary"
            onClick={onPlayPause}
            disabled={!animation}
            $disabled={!animation}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </S.ControlButton>
          <S.FrameCounter>
            Frame {currentFrame} / {totalFrames}
          </S.FrameCounter>
          <S.SliderWrapper>
            <Slider
              value={[currentFrame]}
              onValueChange={(value) => onFrameChange(value[0])}
              max={totalFrames}
              step={1}
              disabled={!animation}
            />
          </S.SliderWrapper>
          <Select 
            value={speed.toString()} 
            onValueChange={(value) => onSpeedChange(parseFloat(value))}
            disabled={!animation}
          >
            <S.StyledSelectTrigger>
              <SelectValue />
            </S.StyledSelectTrigger>
            <S.StyledSelectContent>
              <SelectItem value="0.25">0.25x</SelectItem>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </S.StyledSelectContent>
          </Select>
          <S.ControlButton
            $variant="outline"
            $active={loop}
            onClick={onLoopToggle}
            disabled={!animation}
            $disabled={!animation}
          >
            <Repeat size={16} />
          </S.ControlButton>
          <S.Divider>
            <S.ControlButton
              $variant="ghost"
              onClick={zoomOut}
              disabled={!animation}
              $disabled={!animation}
            >
              <ZoomOut size={16} />
            </S.ControlButton>
            <S.ZoomLabel>{zoomLevel}%</S.ZoomLabel>
            <S.ControlButton
              $variant="ghost"
              onClick={zoomIn}
              disabled={!animation}
              $disabled={!animation}
            >
              <ZoomIn size={16} />
            </S.ControlButton>
          </S.Divider>
        </S.ControlsInner>
      </S.ControlsBar>
    </S.PanelContainer>
  );
}
