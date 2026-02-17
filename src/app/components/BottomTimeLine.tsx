import { ZoomIn, ZoomOut, Layers } from 'lucide-react';
import { LottieAnimation, LottieLayer } from '../../types/lottie';
import { useUIStore } from '../../stores/uiStore';
import {
  useMemo, useRef, useCallback, useEffect, useState, memo
} from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const ROW_H        = 24;   // px per layer row
const RULER_H      = 28;   // px ruler
const HEADER_H     = 36;   // px top bar
const LABEL_W      = 180;  // px label column
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

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Ruler ────────────────────────────────────────────────────────────────────

const Ruler = memo(({ total, zoom, fps }: { total: number; zoom: number; fps: number }) => {
  const interval = rulerInterval(total, zoom);
  const marks = useMemo(() => {
    const r=[]; for (let f=0; f<=total; f+=interval) r.push(f); return r;
  }, [total, interval]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* alternating band every 10f */}
      {Array.from({length: Math.ceil(total/10)}).map((_,i) =>
        i%2===0 ? (
          <div key={i} className="absolute top-0 bottom-0"
            style={{left:`${(i*10/total)*100}%`, width:`${(10/total)*100}%`, background:'rgba(255,255,255,0.014)'}} />
        ) : null
      )}
      {marks.map(f => {
        const pct = (f/total)*100;
        const major = f%(interval*4)===0 || interval>=50;
        return (
          <div key={f} className="absolute top-0 flex flex-col items-center"
            style={{left:`${pct}%`}}>
            <div className={`w-px ${major?'h-3 bg-gray-600':'h-[6px] bg-gray-700/70'}`}/>
            {major && (
              <span className="text-[9px] font-mono text-gray-500 mt-0.5 -translate-x-1/2 whitespace-nowrap leading-none">
                {f}<span className="text-gray-700 ml-0.5">{(f/fps).toFixed(1)}s</span>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});

// ─── Layer row (track side) ───────────────────────────────────────────────────

const TrackRow = memo(({ layer, index, total, isSelected, onSelect }:
  { layer: LottieLayer; index: number; total: number; isSelected: boolean; onSelect:()=>void }) => {
  const kfs = useMemo(() => extractKfs(layer), [layer]);
  const color = LAYER_DOT_COLOR[layer.ty] ?? '#6b7280';
  const ipPct = (layer.ip / total) * 100;
  const widPct = ((layer.op - layer.ip) / total) * 100;

  return (
    <div
      className={`relative border-b border-gray-800/40 transition-colors ${isSelected ? 'bg-blue-500/[0.06]' : 'hover:bg-white/[0.018]'}`}
      style={{ height: ROW_H }}
      onClick={onSelect}
    >
      {/* In-out range bar */}
      <div
        className="absolute top-1/2 -translate-y-1/2 rounded-sm pointer-events-none"
        style={{
          left: `${ipPct}%`, width: `${widPct}%`, height: 10,
          background: isSelected ? `${color}18` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${isSelected ? color+'40' : 'rgba(255,255,255,0.07)'}`,
        }}
      />
      {/* Keyframe diamonds */}
      {kfs.map(({frame, props}) => (
        <div key={frame}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex gap-px z-10 pointer-events-none"
          style={{left:`${(frame/total)*100}%`}}>
          {props.map(p => (
            <div key={p}
              className="w-[7px] h-[7px] rotate-45 flex-shrink-0"
              style={{backgroundColor: PROP_COLORS[p]??'#9ca3af', borderRadius:1}}
              title={`${PROP_FULL[p]} @ frame ${frame}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
});

// ─── Main ─────────────────────────────────────────────────────────────────────

export function BottomTimeline({
  animation, currentFrame, totalFrames, isPlaying,
  selectedLayerIndex, onFrameChange, onLayerSelect,
}: BottomTimelineProps) {
  const { timelineZoom, setTimelineZoom } = useUIStore();
  const [panelHeight, setPanelHeight] = useState(240);

  // ── Resize ──────────────────────────────────────────────────────────────
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

  // ── Scrub ────────────────────────────────────────────────────────────────
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

  // ── Auto-scroll playhead during playback ─────────────────────────────────
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isPlaying || !scrollRef.current || !trackRef.current) return;
    const pct = currentFrame / Math.max(1, totalFrames);
    const tw = trackRef.current.scrollWidth;
    const vw = scrollRef.current.clientWidth;
    scrollRef.current.scrollLeft = Math.max(0, pct*tw - vw*0.4);
  }, [currentFrame, isPlaying, totalFrames]);

  // ── Sync vertical scroll: track → labels ─────────────────────────────────
  const labelScrollRef = useRef<HTMLDivElement>(null);
  const onTrackScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (labelScrollRef.current)
      labelScrollRef.current.scrollTop = e.currentTarget.scrollTop;
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────
  const fps = animation?.fr ?? 30;
  const currentSec = fps > 0 ? (currentFrame/fps).toFixed(2) : '0.00';
  const playPct = totalFrames > 0 ? (currentFrame/totalFrames)*100 : 0;
  const layers = animation?.layers ?? [];

  // ── Empty ────────────────────────────────────────────────────────────────
  if (!animation) {
    return (
      <div className="bg-gray-950 border-t border-gray-800/60 flex items-center justify-center" style={{height: MIN_H}}>
        <div className="flex flex-col items-center gap-2">
          <Layers className="w-6 h-6 text-gray-700" />
          <span className="text-[11px] font-mono text-gray-600 tracking-wide">load an animation to see the timeline</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 border-t border-gray-800/60 flex flex-col select-none overflow-hidden"
      style={{height: panelHeight}}>

      {/* ── Drag resize handle ── */}
      <div
        className="h-[3px] flex-shrink-0 cursor-row-resize group"
        style={{background: 'transparent'}}
        onMouseDown={onResizeDown}
      >
        <div className="h-px bg-gray-800/60 group-hover:bg-blue-500/50 transition-colors mt-1" />
      </div>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 border-b border-gray-800/60 flex-shrink-0"
        style={{height: HEADER_H}}>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Timeline</span>
          {isPlaying && (
            <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 rounded px-1.5 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] text-red-400 font-mono uppercase tracking-wide">Live</span>
            </div>
          )}
        </div>

        {/* Frame counter */}
        <div className="flex items-center gap-1.5 bg-gray-900 border border-gray-800 rounded px-2 py-0.5">
          <span className="text-[10px] font-mono text-blue-400 tabular-nums w-10 text-right">
            {String(currentFrame).padStart(4,'0')}
          </span>
          <span className="text-[10px] text-gray-700">/</span>
          <span className="text-[10px] font-mono text-gray-500 tabular-nums">
            {String(totalFrames).padStart(4,'0')}
          </span>
          <div className="w-px h-3 bg-gray-800 mx-0.5" />
          <span className="text-[10px] font-mono text-gray-500">{currentSec}s</span>
          <span className="text-[10px] text-gray-700 ml-0.5">{fps}fps</span>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-0.5">
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
            onClick={() => setTimelineZoom(clamp(timelineZoom-0.25, 0.25, 8))}>
            <ZoomOut className="w-3 h-3" />
          </button>
          <button className="text-[10px] font-mono text-gray-500 hover:text-gray-300 w-10 text-center tabular-nums"
            onClick={() => setTimelineZoom(1)} title="Reset zoom">
            {Math.round(timelineZoom*100)}%
          </button>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
            onClick={() => setTimelineZoom(clamp(timelineZoom+0.25, 0.25, 8))}>
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── Body: labels + track ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Label column */}
        <div className="flex-shrink-0 border-r border-gray-800/60 flex flex-col overflow-hidden"
          style={{width: LABEL_W}}>

          {/* Ruler-height header */}
          <div className="flex-shrink-0 border-b border-gray-800/60 bg-gray-950 flex items-end px-2 pb-1"
            style={{height: RULER_H}}>
            <span className="text-[9px] text-gray-600 uppercase tracking-widest">
              {layers.length} layers
            </span>
          </div>

          {/* Layer names */}
          <div ref={labelScrollRef}
            className="flex-1 overflow-y-auto overflow-x-hidden"
            style={{scrollbarWidth:'none'}}>
            {layers.map((layer, idx) => {
              const sel = selectedLayerIndex === idx;
              const dot = LAYER_DOT_COLOR[layer.ty] ?? '#6b7280';
              const animated = hasKfs(layer);
              return (
                <div key={idx}
                  className={`flex items-center gap-1.5 px-2 border-b border-gray-800/40 cursor-pointer transition-colors flex-shrink-0 ${
                    sel ? 'bg-blue-500/[0.07] border-l-2 border-l-blue-500' : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'
                  }`}
                  style={{height: ROW_H}}
                  onClick={() => onLayerSelect(idx)}
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor: dot}} />
                  <span className={`text-[10px] font-mono flex-1 truncate ${sel ? 'text-blue-300' : 'text-gray-400'}`}>
                    {layer.nm || `Layer ${idx}`}
                  </span>
                  {animated && <div className="w-1 h-1 rounded-full bg-amber-500/70 flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Track (horizontally + vertically scrollable) */}
        <div ref={scrollRef}
          className="flex-1 overflow-x-auto overflow-y-auto"
          style={{scrollbarWidth:'thin', scrollbarColor:'#374151 transparent'}}
          onScroll={onTrackScroll}
        >
          <div
            ref={trackRef}
            className={`relative ${draggingState ? 'cursor-grabbing' : 'cursor-crosshair'}`}
            style={{
              minWidth: `${timelineZoom*100}%`,
              width: `${timelineZoom*100}%`,
              minHeight: '100%',
            }}
            onMouseDown={onTrackDown}
          >
            {/* Sticky ruler */}
            <div className="sticky top-0 z-20 border-b border-gray-800/60 bg-gray-950"
              style={{height: RULER_H, position:'sticky'}}>
              <Ruler total={totalFrames} zoom={timelineZoom} fps={fps} />
            </div>

            {/* Layer rows */}
            {layers.map((layer, idx) => (
              <TrackRow key={idx}
                layer={layer} index={idx} total={totalFrames}
                isSelected={selectedLayerIndex===idx}
                onSelect={() => onLayerSelect(idx)}
              />
            ))}

            {/* Progress tint */}
            <div className="absolute top-0 bottom-0 left-0 pointer-events-none z-0"
              style={{width:`${playPct}%`, background:'rgba(96,165,250,0.025)'}} />

            {/* Playhead — full height, always on top */}
            <div className="absolute top-0 bottom-0 pointer-events-none z-30"
              style={{
                left:`${playPct}%`,
                width:'1px',
                background:'rgba(239,68,68,0.85)',
                boxShadow:'0 0 6px rgba(239,68,68,0.3)',
              }}>
              {/* Triangle cap */}
              <div className="absolute w-0 h-0" style={{
                top:0, left:'50%', transform:'translateX(-50%)',
                borderLeft:'5px solid transparent',
                borderRight:'5px solid transparent',
                borderTop:'7px solid rgb(239,68,68)',
              }}/>
              {/* Frame label */}
              <div className="absolute bg-red-500 text-white text-[9px] font-mono px-1 py-px rounded-sm whitespace-nowrap"
                style={{top:1, left:7}}>
                {currentFrame}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}