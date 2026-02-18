import styled from 'styled-components';
import { ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { LottieAnimation, LottieLayer } from '../../types/lottie';
import { useUIStore } from '../../stores/uiStore';
import {
  useMemo, useRef, useCallback, useEffect, useState, memo
} from 'react';

const ROW_H        = 24;  
const RULER_H      = 28;
const HEADER_H     = 36; 
const LABEL_W      = 180;
const MIN_H        = 160;
const MAX_H        = 520;

const PROP_COLORS: Record<string, string> = {
  p: '#60a5fa', s: '#34d399', r: '#f59e0b', o: '#a78bfa', a: '#f472b6',
};
const PROP_FULL: Record<string, string> = {
  p: 'Position', s: 'Scale', r: 'Rotation', o: 'Opacity', a: 'Anchor',
};
const LAYER_DOT_COLOR: Record<number, string> = {
  0: '#a78bfa', 1: '#fbbf24', 2: '#34d399', 3: '#6b7280', 4: '#60a5fa', 5: '#f472b6',
};

interface BottomTimelineProps {
  animation:            LottieAnimation | null;
  currentFrame:         number;
  totalFrames:          number;
  isPlaying:            boolean;
  selectedLayerIndex:   number | null;
  onFrameChange:        (frame: number) => void;
  onLayerSelect:        (index: number) => void;
}

interface KfData { frame: number; props: string[] }

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function extractKfs(layer: LottieLayer): KfData[] {
  const map = new Map<number, string[]>();
  const scan = (prop: any, k: string) => {
    if (prop?.a === 1 && Array.isArray(prop.k))
      prop.k.forEach((kf: any) => {
        if (typeof kf.t === 'number') {
          const e = map.get(kf.t) ?? []; if (!e.includes(k)) e.push(k); map.set(kf.t, e);
        }
      });
  };
  if (layer.ks) { scan(layer.ks.p,'p'); scan(layer.ks.s,'s'); scan(layer.ks.r,'r'); scan(layer.ks.o,'o'); }
  return Array.from(map.entries()).map(([frame,props])=>({frame,props})).sort((a,b)=>a.frame-b.frame);
}

const hasKfs = (l: LottieLayer) =>
  [l.ks?.p, l.ks?.s, l.ks?.r, l.ks?.o].some(p => p?.a===1 && Array.isArray(p.k) && p.k.length>0);

function rulerInterval(total: number, zoom: number) {
  const raw = total / (24 * zoom);
  return [1,2,5,10,20,25,50,100,200,500].find(n => n >= raw) ?? 500;
}

// Styled Components
const RulerContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

const RulerStripe = styled.div<{ left: string; width: string }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ left }) => left};
  width: ${({ width }) => width};
  background: rgba(255, 255, 255, 0.014);
`;

const RulerMark = styled.div<{ left: string }>`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  left: ${({ left }) => left};
`;

const RulerTickMajor = styled.div`
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.gray600};
`;

const RulerTickMinor = styled.div`
  width: 1px;
  height: 6px;
  background-color: rgba(63, 63, 70, 0.7);
`;

const RulerLabel = styled.span`
  font-size: 9px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 2px;
  transform: translateX(-50%);
  white-space: nowrap;
  line-height: 1;
`;

const RulerLabelTime = styled.span`
  color: ${({ theme }) => theme.colors.gray700};
  margin-left: 2px;
`;

const TrackRowContainer = styled.div<{ isSelected: boolean }>`
  position: relative;
  border-bottom: 1px solid rgba(39, 39, 42, 0.4);
  height: ${ROW_H}px;
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(59, 130, 246, 0.06)' : 'transparent'};

  &:hover {
    background-color: ${({ isSelected }) =>
      isSelected ? 'rgba(59, 130, 246, 0.06)' : 'rgba(255, 255, 255, 0.018)'};
  }
`;

const LayerDurationBar = styled.div<{ ipPct: number; widPct: number; color: string; isSelected: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${({ ipPct }) => ipPct}%;
  width: ${({ widPct }) => widPct}%;
  height: 10px;
  border-radius: 2px;
  pointer-events: none;
  background: ${({ isSelected, color }) =>
    isSelected ? `${color}18` : 'rgba(255, 255, 255, 0.04)'};
  border: 1px solid ${({ isSelected, color }) =>
    isSelected ? `${color}40` : 'rgba(255, 255, 255, 0.07)'};
`;

const KeyframeContainer = styled.div<{ left: string }>`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: ${({ left }) => left};
  display: flex;
  gap: 1px;
  z-index: 10;
  pointer-events: none;
`;

const KeyframeDot = styled.div<{ color: string }>`
  width: 7px;
  height: 7px;
  transform: rotate(45deg);
  flex-shrink: 0;
  background-color: ${({ color }) => color};
  border-radius: 1px;
`;

const Container = styled.div<{ height: number }>`
  background-color: ${({ theme }) => theme.colors.gray950};
  border-top: 1px solid rgba(39, 39, 42, 0.6);
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: hidden;
  height: ${({ height }) => height}px;
`;

const ResizeHandle = styled.div`
  height: 3px;
  flex-shrink: 0;
  cursor: row-resize;
  background: transparent;

  &:hover > div {
    background-color: rgba(59, 130, 246, 0.5);
  }
`;

const ResizeBar = styled.div`
  height: 1px;
  background-color: rgba(39, 39, 42, 0.6);
  margin-top: 4px;
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid rgba(39, 39, 42, 0.6);
  flex-shrink: 0;
  height: ${HEADER_H}px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const TimelineLabel = styled.span`
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.gray500};
`;

const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  padding: 2px 6px;
`;

const LiveDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.red500};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const LiveText = styled.span`
  font-size: 9px;
  color: #f87171;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FrameCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${({ theme }) => theme.colors.gray900};
  border: 1px solid ${({ theme }) => theme.colors.gray800};
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  padding: 2px ${({ theme }) => theme.spacing[2]};
`;

const CurrentFrame = styled.span`
  font-size: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.blue400};
  font-variant-numeric: tabular-nums;
  width: 40px;
  text-align: right;
`;

const FrameSeparator = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray700};
`;

const TotalFrame = styled.span`
  font-size: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray500};
  font-variant-numeric: tabular-nums;
`;

const FrameDivider = styled.div`
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.gray800};
  margin: 0 2px;
`;

const TimeDisplay = styled.span`
  font-size: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray500};
`;

const FpsDisplay = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray700};
  margin-left: 2px;
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const ZoomButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  color: ${({ theme }) => theme.colors.gray500};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.DEFAULT};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray800};
    color: ${({ theme }) => theme.colors.gray300};
  }
`;

const ZoomDisplay = styled.button`
  font-size: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray500};
  width: 40px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.DEFAULT};

  &:hover {
    color: ${({ theme }) => theme.colors.gray300};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const LabelColumn = styled.div`
  flex-shrink: 0;
  border-right: 1px solid rgba(39, 39, 42, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: ${LABEL_W}px;
`;

const LabelHeader = styled.div`
  flex-shrink: 0;
  border-bottom: 1px solid rgba(39, 39, 42, 0.6);
  background-color: ${({ theme }) => theme.colors.gray950};
  display: flex;
  align-items: flex-end;
  padding: 0 ${({ theme }) => theme.spacing[2]} 4px;
  height: ${RULER_H}px;
`;

const LayerCount = styled.span`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.gray600};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const LabelScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const LayerLabelRow = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 ${({ theme }) => theme.spacing[2]};
  border-bottom: 1px solid rgba(39, 39, 42, 0.4);
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};
  flex-shrink: 0;
  height: ${ROW_H}px;
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(59, 130, 246, 0.07)' : 'transparent'};
  border-left: 2px solid ${({ isSelected, theme }) =>
    isSelected ? theme.colors.blue500 : 'transparent'};

  &:hover {
    background-color: ${({ isSelected }) =>
      isSelected ? 'rgba(59, 130, 246, 0.07)' : 'rgba(255, 255, 255, 0.02)'};
  }
`;

const LayerDot = styled.div<{ color: string }>`
  width: 6px;
  height: 6px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  flex-shrink: 0;
  background-color: ${({ color }) => color};
`;

const LayerName = styled.span<{ isSelected: boolean }>`
  font-size: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ isSelected, theme }) =>
    isSelected ? '#93c5fd' : theme.colors.gray400};
`;

const AnimatedIndicator = styled.div`
  width: 4px;
  height: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: rgba(251, 191, 36, 0.7);
  flex-shrink: 0;
`;

const TrackScrollContainer = styled.div`
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TrackContainer = styled.div<{ zoom: number; isDragging: boolean }>`
  position: relative;
  min-width: ${({ zoom }) => zoom * 100}%;
  width: ${({ zoom }) => zoom * 100}%;
  min-height: 100%;
  cursor: ${({ isDragging }) => isDragging ? 'grabbing' : 'crosshair'};
`;

const RulerHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid rgba(39, 39, 42, 0.6);
  background-color: ${({ theme }) => theme.colors.gray950};
  height: ${RULER_H}px;
`;

const PlayheadOverlay = styled.div<{ playPct: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
  width: ${({ playPct }) => playPct}%;
  background: rgba(96, 165, 250, 0.025);
`;

const PlayheadLine = styled.div<{ playPct: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 30;
  left: ${({ playPct }) => playPct}%;
  width: 1px;
  background: rgba(239, 68, 68, 0.85);
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.3);
`;

const PlayheadTriangle = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid rgb(239, 68, 68);
`;

const PlayheadLabel = styled.div`
  position: absolute;
  top: 4px;
  left: 28px;
  background-color: ${({ theme }) => theme.colors.red500};
  color: ${({ theme }) => theme.colors.white};
  font-size: 9px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  padding: 1px 4px;
  border-radius: 2px;
  white-space: nowrap;
`;

const EmptyState = styled.div`
  background-color: ${({ theme }) => theme.colors.gray950};
  border-top: 1px solid rgba(39, 39, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${MIN_H}px;
`;

const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const EmptyIcon = styled(Layers)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.gray700};
`;

const EmptyText = styled.span`
  font-size: 11px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray600};
  letter-spacing: 0.05em;
`;

const Ruler = memo(({ total, zoom, fps }: { total: number; zoom: number; fps: number }) => {
  const interval = rulerInterval(total, zoom);
  const marks = useMemo(() => {
    const r=[]; for (let f=0; f<=total; f+=interval) r.push(f); return r;
  }, [total, interval]);

  return (
    <RulerContainer>
      {Array.from({length: Math.ceil(total/10)}).map((_,i) =>
        i%2===0 ? (
          <RulerStripe
            key={i}
            left={`${(i*10/total)*100}%`}
            width={`${(10/total)*100}%`}
          />
        ) : null
      )}
      {marks.map(f => {
        const pct = (f/total)*100;
        const major = f%(interval*4)===0 || interval>=50;
        return (
          <RulerMark key={f} left={`${pct}%`}>
            {major ? <RulerTickMajor /> : <RulerTickMinor />}
            {major && (
              <RulerLabel>
                {f}<RulerLabelTime>{(f/fps).toFixed(1)}s</RulerLabelTime>
              </RulerLabel>
            )}
          </RulerMark>
        );
      })}
    </RulerContainer>
  );
});

const TrackRow = memo(({ layer, index: _index, total, isSelected, onSelect }:
  { layer: LottieLayer; index: number; total: number; isSelected: boolean; onSelect:()=>void }) => {
  const kfs = useMemo(() => extractKfs(layer), [layer]);
  const color = LAYER_DOT_COLOR[layer.ty] ?? '#6b7280';
  const ipPct = (layer.ip / total) * 100;
  const widPct = ((layer.op - layer.ip) / total) * 100;

  return (
    <TrackRowContainer isSelected={isSelected} onClick={onSelect}>
      <LayerDurationBar
        ipPct={ipPct}
        widPct={widPct}
        color={color}
        isSelected={isSelected}
      />
      {kfs.map(({frame, props}) => (
        <KeyframeContainer key={frame} left={`${(frame/total)*100}%`}>
          {props.map(p => (
            <KeyframeDot
              key={p}
              color={PROP_COLORS[p] ?? '#9ca3af'}
              title={`${PROP_FULL[p]} @ frame ${frame}`}
            />
          ))}
        </KeyframeContainer>
      ))}
    </TrackRowContainer>
  );
});

export function BottomTimeline({
  animation, currentFrame, totalFrames, isPlaying,
  selectedLayerIndex, onFrameChange, onLayerSelect,
}: BottomTimelineProps) {
  const { timelineZoom, setTimelineZoom } = useUIStore();
  const [panelHeight, setPanelHeight] = useState(240);
  const resizing = useRef(false);
  const resizeY0 = useRef(0);
  const resizeH0 = useRef(0);

  const onResizeDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); resizing.current=true; resizeY0.current=e.clientY; resizeH0.current=panelHeight;
  }, [panelHeight]);

  useEffect(() => {
    const mv = (e: MouseEvent) => { if (!resizing.current) return; setPanelHeight(clamp(resizeH0.current+(resizeY0.current-e.clientY), MIN_H, MAX_H)); };
    const up = () => { resizing.current=false; };
    window.addEventListener('mousemove', mv);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); };
  }, []);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [draggingState, setDraggingState] = useState(false);

  const frameFromX = useCallback((cx: number) => {
    if (!trackRef.current) return 0;
    const r = trackRef.current.getBoundingClientRect();
    return Math.round(clamp((cx-r.left)/r.width, 0, 1) * totalFrames);
  }, [totalFrames]);

  const onTrackDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); dragging.current=true; setDraggingState(true); onFrameChange(frameFromX(e.clientX));
  }, [frameFromX, onFrameChange]);

  useEffect(() => {
    const mv = (e: MouseEvent) => { if (dragging.current) onFrameChange(frameFromX(e.clientX)); };
    const up = () => { dragging.current=false; setDraggingState(false); };
    window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); };
  }, [frameFromX, onFrameChange]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isPlaying || !scrollRef.current || !trackRef.current) return;
    const pct = currentFrame / Math.max(1, totalFrames);
    const tw = trackRef.current.scrollWidth;
    const vw = scrollRef.current.clientWidth;
    scrollRef.current.scrollLeft = Math.max(0, pct*tw - vw*0.4);
  }, [currentFrame, isPlaying, totalFrames]);

  const labelScrollRef = useRef<HTMLDivElement>(null);
  const onTrackScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (labelScrollRef.current)
      labelScrollRef.current.scrollTop = e.currentTarget.scrollTop;
  }, []);

  const fps = animation?.fr ?? 30;
  const currentSec = fps > 0 ? (currentFrame/fps).toFixed(2) : '0.00';
  const playPct = totalFrames > 0 ? (currentFrame/totalFrames)*100 : 0;
  const layers = animation?.layers ?? [];

  if (!animation) {
    return (
      <EmptyState>
        <EmptyContent>
          <EmptyIcon />
          <EmptyText>load an animation to see the timeline</EmptyText>
        </EmptyContent>
      </EmptyState>
    );
  }

  return (
    <Container height={panelHeight}>
      <ResizeHandle onMouseDown={onResizeDown}>
        <ResizeBar />
      </ResizeHandle>
      <Header>
        <HeaderLeft>
          <TimelineLabel>Timeline</TimelineLabel>
          {isPlaying && (
            <LiveBadge>
              <LiveDot />
              <LiveText>Live</LiveText>
            </LiveBadge>
          )}
        </HeaderLeft>
        <FrameCounter>
          <CurrentFrame>
            {String(currentFrame).padStart(4,'0')}
          </CurrentFrame>
          <FrameSeparator>/</FrameSeparator>
          <TotalFrame>
            {String(totalFrames).padStart(4,'0')}
          </TotalFrame>
          <FrameDivider />
          <TimeDisplay>{currentSec}s</TimeDisplay>
          <FpsDisplay>{fps}fps</FpsDisplay>
        </FrameCounter>
        <ZoomControls>
          <ZoomButton onClick={() => setTimelineZoom(clamp(timelineZoom-0.25, 0.25, 8))}>
            <ZoomOut className="w-3 h-3" />
          </ZoomButton>
          <ZoomDisplay onClick={() => setTimelineZoom(1)} title="Reset zoom">
            {Math.round(timelineZoom*100)}%
          </ZoomDisplay>
          <ZoomButton onClick={() => setTimelineZoom(clamp(timelineZoom+0.25, 0.25, 8))}>
            <ZoomIn className="w-3 h-3" />
          </ZoomButton>
        </ZoomControls>
      </Header>
      <ContentWrapper>
        <LabelColumn>
          <LabelHeader>
            <LayerCount>
              {layers.length} layers
            </LayerCount>
          </LabelHeader>
          <LabelScrollContainer ref={labelScrollRef}>
            {layers.map((layer, idx) => {
              const sel = selectedLayerIndex === idx;
              const dot = LAYER_DOT_COLOR[layer.ty] ?? '#6b7280';
              const animated = hasKfs(layer);
              return (
                <LayerLabelRow
                  key={idx}
                  isSelected={sel}
                  onClick={() => onLayerSelect(idx)}
                >
                  <LayerDot color={dot} />
                  <LayerName isSelected={sel}>
                    {layer.nm || `Layer ${idx}`}
                  </LayerName>
                  {animated && <AnimatedIndicator />}
                </LayerLabelRow>
              );
            })}
          </LabelScrollContainer>
        </LabelColumn>
        <TrackScrollContainer ref={scrollRef} onScroll={onTrackScroll}>
          <TrackContainer
            ref={trackRef}
            zoom={timelineZoom}
            isDragging={draggingState}
            onMouseDown={onTrackDown}
          >
            <RulerHeader>
              <Ruler total={totalFrames} zoom={timelineZoom} fps={fps} />
            </RulerHeader>
            {layers.map((layer, idx) => (
              <TrackRow key={idx}
                layer={layer} index={idx} total={totalFrames}
                isSelected={selectedLayerIndex===idx}
                onSelect={() => onLayerSelect(idx)}
              />
            ))}
            <PlayheadOverlay playPct={playPct} />
            <PlayheadLine playPct={playPct}>
              <PlayheadTriangle />
              <PlayheadLabel>
                {currentFrame}
              </PlayheadLabel>
            </PlayheadLine>
          </TrackContainer>
        </TrackScrollContainer>
      </ContentWrapper>
    </Container>
  );
}
