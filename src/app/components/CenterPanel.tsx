import styled from 'styled-components';
import { Play, Pause, ZoomIn, ZoomOut, Repeat } from 'lucide-react';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { LottieAnimation, RenderMode } from '../../types/lottie';
import { useUIStore } from '../../stores/uiStore';
import { usePlaybackTicker } from '../../hooks/usePlaybackTicker';

const PanelContainer = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.gray950};
  display: flex;
  flex-direction: column;
`;

const ViewportArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  overflow: auto;
`;

const EmptyState = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

const EmptyTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const EmptySubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const CanvasWrapper = styled.div<{ $width: number; $height: number }>`
  position: relative;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray800};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  overflow: hidden;
  background-image: 
    linear-gradient(45deg, #1f2937 25%, transparent 25%),
    linear-gradient(-45deg, #1f2937 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #1f2937 75%),
    linear-gradient(-45deg, transparent 75%, #1f2937 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`;

const LottieContainer = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

const SelectionOverlay = styled.div`
  position: absolute;
  inset: 0;
  border: 2px solid ${({ theme }) => theme.colors.blue500};
  pointer-events: none;
`;

const SelectionCorner = styled.div<{ $position: 'tl' | 'tr' | 'bl' | 'br' }>`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.blue500};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  
  ${({ $position }) => {
    switch ($position) {
      case 'tl': return 'top: -4px; left: -4px;';
      case 'tr': return 'top: -4px; right: -4px;';
      case 'bl': return 'bottom: -4px; left: -4px;';
      case 'br': return 'bottom: -4px; right: -4px;';
    }
  }}
`;

const ControlsBar = styled.div`
  background-color: ${({ theme }) => theme.colors.gray900};
  border-top: 1px solid ${({ theme }) => theme.colors.gray800};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ControlsInner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  max-width: 64rem;
  margin: 0 auto;
`;

const ControlButton = styled.button<{ $variant?: 'primary' | 'outline' | 'ghost'; $active?: boolean; $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing[1.5]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.DEFAULT};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  ${({ $variant, $active, theme }) => {
    if ($variant === 'primary' || !$variant) {
      return `
        background-color: ${theme.colors.blue600};
        color: ${theme.colors.white};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.blue500};
        }
      `;
    }
    if ($variant === 'outline') {
      if ($active) {
        return `
          background-color: ${theme.colors.blue600};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.blue500};
          }
        `;
      }
      return `
        background-color: ${theme.colors.gray800};
        border: 1px solid ${theme.colors.gray700};
        color: ${theme.colors.gray400};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.gray700};
          color: ${theme.colors.white};
        }
      `;
    }
    if ($variant === 'ghost') {
      return `
        background-color: transparent;
        color: ${theme.colors.gray400};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.gray800};
          color: ${theme.colors.white};
        }
      `;
    }
  }}
`;

const FrameCounter = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray400};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  min-width: 100px;
`;

const SliderWrapper = styled.div`
  flex: 1;
`;

const Divider = styled.div`
  border-left: 1px solid ${({ theme }) => theme.colors.gray700};
  padding-left: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ZoomLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray400};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  min-width: 45px;
  text-align: center;
`;

const StyledSelectTrigger = styled(SelectTrigger)`
  width: 100px;
//   height: 32px;
`;

const StyledSelectContent = styled(SelectContent)`
  /* Content styling handled by select.tsx */
`;

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
    <PanelContainer>
      <ViewportArea>
        {!animation ? (
          <EmptyState>
            <EmptyTitle>No animation loaded</EmptyTitle>
            <EmptySubtitle>Upload a Lottie JSON file to get started</EmptySubtitle>
          </EmptyState>
        ) : (
          <CanvasWrapper $width={scaledWidth} $height={scaledHeight}>
            <LottieContainer ref={containerRef} />
            {selectedLayerIndex !== null && (
              <SelectionOverlay>
                <SelectionCorner $position="tl" />
                <SelectionCorner $position="tr" />
                <SelectionCorner $position="bl" />
                <SelectionCorner $position="br" />
              </SelectionOverlay>
            )}
          </CanvasWrapper>
        )}
      </ViewportArea>
      <ControlsBar>
        <ControlsInner>
          <ControlButton
            $variant="primary"
            onClick={onPlayPause}
            disabled={!animation}
            $disabled={!animation}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </ControlButton>
          <FrameCounter>
            Frame {currentFrame} / {totalFrames}
          </FrameCounter>
          <SliderWrapper>
            <Slider
              value={[currentFrame]}
              onValueChange={(value) => onFrameChange(value[0])}
              max={totalFrames}
              step={1}
              disabled={!animation}
            />
          </SliderWrapper>
          <Select 
            value={speed.toString()} 
            onValueChange={(value) => onSpeedChange(parseFloat(value))}
            disabled={!animation}
          >
            <StyledSelectTrigger>
              <SelectValue />
            </StyledSelectTrigger>
            <StyledSelectContent>
              <SelectItem value="0.25">0.25x</SelectItem>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </StyledSelectContent>
          </Select>
          <ControlButton
            $variant="outline"
            $active={loop}
            onClick={onLoopToggle}
            disabled={!animation}
            $disabled={!animation}
          >
            <Repeat size={16} />
          </ControlButton>
          <Divider>
            <ControlButton
              $variant="ghost"
              onClick={zoomOut}
              disabled={!animation}
              $disabled={!animation}
            >
              <ZoomOut size={16} />
            </ControlButton>
            <ZoomLabel>{zoomLevel}%</ZoomLabel>
            <ControlButton
              $variant="ghost"
              onClick={zoomIn}
              disabled={!animation}
              $disabled={!animation}
            >
              <ZoomIn size={16} />
            </ControlButton>
          </Divider>
        </ControlsInner>
      </ControlsBar>
    </PanelContainer>
  );
}
