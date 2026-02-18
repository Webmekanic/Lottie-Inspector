import { ZoomIn, ZoomOut } from 'lucide-react';
import { LottieAnimation, LottieLayer } from '../../types/lottie';
import { useUIStore } from '../../stores/uiStore';
import {
  useMemo, useRef, useCallback, useEffect, useState, memo
} from 'react';
import * as S from '../../styles/BottomTimeLineStyles';

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

const Ruler = memo(({ total, zoom, fps }: { total: number; zoom: number; fps: number }) => {
  const interval = rulerInterval(total, zoom);
  const marks = useMemo(() => {
    const r=[]; for (let f=0; f<=total; f+=interval) r.push(f); return r;
  }, [total, interval]);

  return (
    <S.RulerContainer>
      {Array.from({length: Math.ceil(total/10)}).map((_,i) =>
        i%2===0 ? (
          <S.RulerStripe
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
          <S.RulerMark key={f} left={`${pct}%`}>
            {major ? <S.RulerTickMajor /> : <S.RulerTickMinor />}
            {major && (
              <S.RulerLabel>
                {f}<S.RulerLabelTime>{(f/fps).toFixed(1)}s</S.RulerLabelTime>
              </S.RulerLabel>
            )}
          </S.RulerMark>
        );
      })}
    </S.RulerContainer>
  );
});

const TrackRow = memo(({ layer, index: _index, total, isSelected, onSelect }:
  { layer: LottieLayer; index: number; total: number; isSelected: boolean; onSelect:()=>void }) => {
  const kfs = useMemo(() => extractKfs(layer), [layer]);
  const color = LAYER_DOT_COLOR[layer.ty] ?? '#6b7280';
  const ipPct = (layer.ip / total) * 100;
  const widPct = ((layer.op - layer.ip) / total) * 100;

  return (
    <S.TrackRowContainer isSelected={isSelected} onClick={onSelect}>
      <S.LayerDurationBar
        ipPct={ipPct}
        widPct={widPct}
        color={color}
        isSelected={isSelected}
      />
      {kfs.map(({frame, props}) => (
        <S.KeyframeContainer key={frame} left={`${(frame/total)*100}%`}>
          {props.map(p => (
            <S.KeyframeDot
              key={p}
              color={PROP_COLORS[p] ?? '#9ca3af'}
              title={`${PROP_FULL[p]} @ frame ${frame}`}
            />
          ))}
        </S.KeyframeContainer>
      ))}
    </S.TrackRowContainer>
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
    const mv = (e: MouseEvent) => { if (!resizing.current) return; setPanelHeight(clamp(resizeH0.current+(resizeY0.current-e.clientY), S.MIN_H, S.MAX_H)); };
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
      <S.EmptyState>
        <S.EmptyContent>
          <S.EmptyIcon />
          <S.EmptyText>load an animation to see the timeline</S.EmptyText>
        </S.EmptyContent>
      </S.EmptyState>
    );
  }

  return (
    <S.Container height={panelHeight}>
      <S.ResizeHandle onMouseDown={onResizeDown}>
        <S.ResizeBar />
      </S.ResizeHandle>
      <S.Header>
        <S.HeaderLeft>
          <S.TimelineLabel>Timeline</S.TimelineLabel>
          {isPlaying && (
            <S.LiveBadge>
              <S.LiveDot />
              <S.LiveText>Live</S.LiveText>
            </S.LiveBadge>
          )}
        </S.HeaderLeft>
        <S.FrameCounter>
          <S.CurrentFrame>
            {String(currentFrame).padStart(4,'0')}
          </S.CurrentFrame>
          <S.FrameSeparator>/</S.FrameSeparator>
          <S.TotalFrame>
            {String(totalFrames).padStart(4,'0')}
          </S.TotalFrame>
          <S.FrameDivider />
          <S.TimeDisplay>{currentSec}s</S.TimeDisplay>
          <S.FpsDisplay>{fps}fps</S.FpsDisplay>
        </S.FrameCounter>
        <S.ZoomControls>
          <S.ZoomButton onClick={() => setTimelineZoom(clamp(timelineZoom-0.25, 0.25, 8))}>
            <ZoomOut className="w-3 h-3" />
          </S.ZoomButton>
          <S.ZoomDisplay onClick={() => setTimelineZoom(1)} title="Reset zoom">
            {Math.round(timelineZoom*100)}%
          </S.ZoomDisplay>
          <S.ZoomButton onClick={() => setTimelineZoom(clamp(timelineZoom+0.25, 0.25, 8))}>
            <ZoomIn className="w-3 h-3" />
          </S.ZoomButton>
        </S.ZoomControls>
      </S.Header>
      <S.ContentWrapper>
        <S.LabelColumn>
          <S.LabelHeader>
            <S.LayerCount>
              {layers.length} layers
            </S.LayerCount>
          </S.LabelHeader>
          <S.LabelScrollContainer ref={labelScrollRef}>
            {layers.map((layer, idx) => {
              const sel = selectedLayerIndex === idx;
              const dot = LAYER_DOT_COLOR[layer.ty] ?? '#6b7280';
              const animated = hasKfs(layer);
              return (
                <S.LayerLabelRow
                  key={idx}
                  isSelected={sel}
                  onClick={() => onLayerSelect(idx)}
                >
                  <S.LayerDot color={dot} />
                  <S.LayerName isSelected={sel}>
                    {`Layer ${layer.nm || `Layer ${idx}`}`}
                  </S.LayerName>
                  {animated && <S.AnimatedIndicator />}
                </S.LayerLabelRow>
              );
            })}
          </S.LabelScrollContainer>
        </S.LabelColumn>
        <S.TrackScrollContainer ref={scrollRef} onScroll={onTrackScroll}>
          <S.TrackContainer
            ref={trackRef}
            zoom={timelineZoom}
            isDragging={draggingState}
            onMouseDown={onTrackDown}
          >
            <S.RulerHeader>
              <Ruler total={totalFrames} zoom={timelineZoom} fps={fps} />
            </S.RulerHeader>
            {layers.map((layer, idx) => (
              <TrackRow key={idx}
                layer={layer} index={idx} total={totalFrames}
                isSelected={selectedLayerIndex===idx}
                onSelect={() => onLayerSelect(idx)}
              />
            ))}
            <S.PlayheadOverlay playPct={playPct} />
            <S.PlayheadLine playPct={playPct}>
              <S.PlayheadTriangle />
              <S.PlayheadLabel>
                {currentFrame}
              </S.PlayheadLabel>
            </S.PlayheadLine>
          </S.TrackContainer>
        </S.TrackScrollContainer>
      </S.ContentWrapper>
    </S.Container>
  );
}
