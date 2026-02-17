import { Label } from './ui/label';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { useEffect, useState, useCallback } from 'react';
import {
  Move,
  Maximize2,
  RotateCw,
  Eye,
  Droplets,
  PenLine,
  Layers,
  Info,
  Clock,
  Link2,
  Unlink2,
  ChevronDown,
  ChevronRight,
  Blend,
} from 'lucide-react';
import { LottieLayer, LottieShape, LottieAnimation } from '../../types/lottie';
import { LottieEvent } from '../../machines/lottieStateMachine';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RightPanelProps {
  selectedLayer: LottieLayer | null;
  selectedLayerIndex: number | null;
  animation: LottieAnimation | null;
  /** Wire directly to XState: send(event) */
  onSend: (event: LottieEvent) => void;
}

interface FillData {
  color: [number, number, number, number]; // rgba 0-1
  opacity: number;
}

interface StrokeData {
  color: [number, number, number, number]; // rgba 0-1
  width: number;
  opacity: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LAYER_TYPE_LABELS: Record<number, string> = {
  0: 'Precomp',
  1: 'Solid',
  2: 'Image',
  3: 'Null',
  4: 'Shape',
  5: 'Text',
};

const BLEND_MODES: Record<number, string> = {
  0: 'Normal',
  1: 'Multiply',
  2: 'Screen',
  3: 'Overlay',
  4: 'Darken',
  5: 'Lighten',
  6: 'Color Dodge',
  7: 'Color Burn',
  8: 'Hard Light',
  9: 'Soft Light',
  10: 'Difference',
  11: 'Exclusion',
};

/** Extract a scalar or indexed value from a Lottie animated property */
function getPropValue(prop: any, index?: number): number {
  if (!prop) return 0;
  if (prop.a === 0) {
    // Static
    if (Array.isArray(prop.k)) return index !== undefined ? (prop.k[index] ?? 0) : prop.k[0] ?? 0;
    return typeof prop.k === 'number' ? prop.k : 0;
  }
  // Animated — use first keyframe start value
  if (Array.isArray(prop.k) && prop.k.length > 0) {
    const kf = prop.k[0];
    if (kf.s) return index !== undefined ? (kf.s[index] ?? 0) : kf.s[0] ?? 0;
  }
  return 0;
}

/** Build an updated animated property preserving animation flag */
function buildUpdatedProp(existing: any, newValue: number, index?: number): any {
  if (!existing) return { a: 0, k: index !== undefined ? [0, 0] : newValue };
  if (existing.a === 0) {
    if (index !== undefined) {
      const arr = Array.isArray(existing.k) ? [...existing.k] : [0, 0];
      arr[index] = newValue;
      return { ...existing, k: arr };
    }
    return { ...existing, k: newValue };
  }
  // Animated — update start value of first keyframe only (non-destructive)
  const keyframes = JSON.parse(JSON.stringify(existing.k));
  if (keyframes[0]) {
    if (index !== undefined) {
      keyframes[0].s = [...(keyframes[0].s || [0, 0])];
      keyframes[0].s[index] = newValue;
    } else {
      keyframes[0].s = [newValue];
    }
  }
  return { ...existing, k: keyframes };
}

/** Convert Lottie color array [0-1, 0-1, 0-1, 1] to CSS hex */
function lottieColorToHex(c: number[]): string {
  const r = Math.round((c[0] ?? 0) * 255);
  const g = Math.round((c[1] ?? 0) * 255);
  const b = Math.round((c[2] ?? 0) * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Convert CSS hex to Lottie color array [0-1, 0-1, 0-1, 1] */
function hexToLottieColor(hex: string): [number, number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [r, g, b, 1];
}

/** Recursively find the first fill shape in a shapes array */
function findFillShape(shapes: LottieShape[] | undefined): LottieShape | null {
  if (!shapes) return null;
  for (const s of shapes) {
    if (s.ty === 'fl' || s.ty === 'gf') return s;
    if (s.ty === 'gr' && s.it) {
      const found = findFillShape(s.it);
      if (found) return found;
    }
  }
  return null;
}

/** Recursively find the first stroke shape in a shapes array */
function findStrokeShape(shapes: LottieShape[] | undefined): LottieShape | null {
  if (!shapes) return null;
  for (const s of shapes) {
    if (s.ty === 'st' || s.ty === 'gs') return s;
    if (s.ty === 'gr' && s.it) {
      const found = findStrokeShape(s.it);
      if (found) return found;
    }
  }
  return null;
}

/** Recursively update fill color in shapes array */
function updateFillColor(shapes: LottieShape[], color: [number, number, number, number]): LottieShape[] {
  return shapes.map((shape) => {
    if (shape.ty === 'fl' || shape.ty === 'gf') {
      return { ...shape, c: { a: 0, k: color } };
    }
    if (shape.ty === 'gr' && shape.it) {
      return { ...shape, it: updateFillColor(shape.it, color) };
    }
    return shape;
  });
}

/** Recursively update fill opacity in shapes array */
function updateFillOpacity(shapes: LottieShape[], opacity: number): LottieShape[] {
  return shapes.map((shape) => {
    if (shape.ty === 'fl' || shape.ty === 'gf') {
      return { ...shape, o: { a: 0, k: opacity } };
    }
    if (shape.ty === 'gr' && shape.it) {
      return { ...shape, it: updateFillOpacity(shape.it, opacity) };
    }
    return shape;
  });
}

/** Recursively update stroke color in shapes array */
function updateStrokeColor(shapes: LottieShape[], color: [number, number, number, number]): LottieShape[] {
  return shapes.map((shape) => {
    if (shape.ty === 'st' || shape.ty === 'gs') {
      return { ...shape, c: { a: 0, k: color } };
    }
    if (shape.ty === 'gr' && shape.it) {
      return { ...shape, it: updateStrokeColor(shape.it, color) };
    }
    return shape;
  });
}

/** Recursively update stroke width in shapes array */
function updateStrokeWidth(shapes: LottieShape[], width: number): LottieShape[] {
  return shapes.map((shape) => {
    if (shape.ty === 'st' || shape.ty === 'gs') {
      return { ...shape, w: { a: 0, k: width } };
    }
    if (shape.ty === 'gr' && shape.it) {
      return { ...shape, it: updateStrokeWidth(shape.it, width) };
    }
    return shape;
  });
}

/** Recursively update stroke opacity in shapes array */
function updateStrokeOpacity(shapes: LottieShape[], opacity: number): LottieShape[] {
  return shapes.map((shape) => {
    if (shape.ty === 'st' || shape.ty === 'gs') {
      return { ...shape, o: { a: 0, k: opacity } };
    }
    if (shape.ty === 'gr' && shape.it) {
      return { ...shape, it: updateStrokeOpacity(shape.it, opacity) };
    }
    return shape;
  });
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  children,
  defaultOpen = true,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        className="w-full flex items-center gap-2 py-2 px-4 hover:bg-gray-800/40 transition-colors group"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon className="w-3 h-3 text-gray-500 flex-shrink-0" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 flex-1 text-left">
          {title}
        </span>
        {open ? (
          <ChevronDown className="w-3 h-3 text-gray-600" />
        ) : (
          <ChevronRight className="w-3 h-3 text-gray-600" />
        )}
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
      <Separator className="bg-gray-800" />
    </div>
  );
}

// ─── Field components ─────────────────────────────────────────────────────────

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-500 w-16 flex-shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  suffix,
  step = 1,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
}) {
  const [local, setLocal] = useState(String(Math.round(value * 100) / 100));

  useEffect(() => {
    setLocal(String(Math.round(value * 100) / 100));
  }, [value]);

  return (
    <div className="relative flex items-center">
      <Input
        type="number"
        value={local}
        step={step}
        min={min}
        max={max}
        onChange={(e) => {
          const newValue = e.target.value;
          setLocal(newValue);
          // Update in real-time if valid number
          const n = parseFloat(newValue);
          if (!isNaN(n)) {
            onChange(n);
          }
        }}
        onBlur={() => {
          const n = parseFloat(local);
          if (!isNaN(n)) onChange(n);
          else setLocal(String(value));
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const n = parseFloat(local);
            if (!isNaN(n)) onChange(n);
          }
        }}
        className="h-7 bg-gray-800 border-gray-700 text-gray-200 text-xs font-mono pr-6"
      />
      {suffix && (
        <span className="absolute right-2 text-[10px] text-gray-500 pointer-events-none">{suffix}</span>
      )}
    </div>
  );
}

function XYInputs({
  labelX = 'X',
  labelY = 'Y',
  x,
  y,
  onChangeX,
  onChangeY,
  suffix,
  linked,
  onToggleLink,
}: {
  labelX?: string;
  labelY?: string;
  x: number;
  y: number;
  onChangeX: (v: number) => void;
  onChangeY: (v: number) => void;
  suffix?: string;
  linked?: boolean;
  onToggleLink?: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1">
        <span className="text-[9px] text-gray-600 block mb-0.5 ml-0.5">{labelX}</span>
        <NumberInput
          value={x}
          onChange={(v) => {
            onChangeX(v);
            if (linked) onChangeY(v);
          }}
          suffix={suffix}
        />
      </div>
      {onToggleLink && (
        <button
          onClick={onToggleLink}
          className="mt-4 p-1 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
          title={linked ? 'Unlink X/Y' : 'Link X/Y'}
        >
          {linked ? (
            <Link2 className="w-3 h-3 text-blue-400" />
          ) : (
            <Unlink2 className="w-3 h-3 text-gray-600" />
          )}
        </button>
      )}
      <div className="flex-1">
        <span className="text-[9px] text-gray-600 block mb-0.5 ml-0.5">{labelY}</span>
        <NumberInput
          value={y}
          onChange={(v) => {
            onChangeY(v);
            if (linked) onChangeX(v);
          }}
          suffix={suffix}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function RightPanel({
  selectedLayer,
  selectedLayerIndex,
  animation,
  onSend,
}: RightPanelProps) {
  const [linkedScale, setLinkedScale] = useState(false);

  // ── Derived transform values ──
  const transform = selectedLayer?.ks;
  const posX = getPropValue(transform?.p, 0);
  const posY = getPropValue(transform?.p, 1);
  const scaleX = getPropValue(transform?.s, 0);
  const scaleY = getPropValue(transform?.s, 1);
  const anchorX = getPropValue(transform?.a, 0);
  const anchorY = getPropValue(transform?.a, 1);
  const rotation = getPropValue(transform?.r);
  const opacity = getPropValue(transform?.o);

  // ── Derived fill/stroke from shape layer ──
  const fillShape = findFillShape(selectedLayer?.shapes);
  const strokeShape = findStrokeShape(selectedLayer?.shapes);
  const fillColor = fillShape?.c ? getPropValue(fillShape.c) : null;
  const fillColorArr = fillShape?.c?.a === 0 ? (fillShape.c.k as number[]) : null;
  const fillOpacity = fillShape?.o ? getPropValue(fillShape.o) : 100;
  const strokeColorArr = strokeShape?.c?.a === 0 ? (strokeShape.c.k as number[]) : null;
  const strokeWidth = strokeShape?.w ? getPropValue(strokeShape.w) : 2;
  const strokeOpacity = strokeShape?.o ? getPropValue(strokeShape.o) : 100;

  // ── Send helpers ──
  const updateLayerProp = useCallback(
    (property: string, value: any) => {
      if (selectedLayerIndex === null) return;
      onSend({ type: 'UPDATE_LAYER_PROPERTY', layerIndex: selectedLayerIndex, property, value });
    },
    [selectedLayerIndex, onSend]
  );

  const updateTransform = useCallback(
    (key: 'p' | 's' | 'r' | 'o' | 'a', newValue: number, index?: number) => {
      if (!selectedLayer) return;
      const existing = selectedLayer.ks[key];
      const updated = buildUpdatedProp(existing, newValue, index);
      updateLayerProp(`ks.${key}`, updated);
    },
    [selectedLayer, updateLayerProp]
  );

  // ── Empty state ──
  if (!selectedLayer || selectedLayerIndex === null) {
    return (
      <div className="w-[300px] bg-gray-900 border-l border-gray-800 flex flex-col items-center justify-center gap-3">
        <Layers className="w-10 h-10 text-gray-700" />
        <p className="text-gray-600 text-xs text-center leading-relaxed px-6">
          Select a layer in the panel to inspect and edit its properties
        </p>
      </div>
    );
  }

  const layerTypeLabel = LAYER_TYPE_LABELS[selectedLayer.ty] ?? 'Unknown';
  const isShapeLayer = selectedLayer.ty === 4;
  const isAnimated = (prop: any) => prop?.a === 1;

  return (
    <div className="w-[300px] bg-gray-900 border-l border-gray-800 flex flex-col h-full overflow-y-auto">

      {/* ── Layer header ── */}
      <div className="px-4 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">
              {selectedLayer.nm || `Layer ${selectedLayerIndex}`}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-gray-500">{layerTypeLabel} Layer</span>
              <span className="text-[10px] text-gray-600">#{selectedLayer.ind}</span>
              {selectedLayer.parent !== undefined && (
                <span className="text-[10px] text-blue-400/70">↳ {selectedLayer.parent}</span>
              )}
            </div>
          </div>
          {/* Animated indicator */}
          {(isAnimated(transform?.p) || isAnimated(transform?.r) || isAnimated(transform?.s)) && (
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5 flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[9px] text-amber-400 uppercase tracking-wide">Animated</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Transform Section ── */}
      <Section icon={Move} title="Transform">

        {/* Position */}
        <div>
          <span className="text-[10px] text-gray-600 block mb-1.5">
            Position {isAnimated(transform?.p) && <span className="text-amber-400 ml-1">◆</span>}
          </span>
          <XYInputs
            x={posX}
            y={posY}
            onChangeX={(v) => updateTransform('p', v, 0)}
            onChangeY={(v) => updateTransform('p', v, 1)}
            suffix="px"
          />
        </div>

        {/* Anchor Point */}
        <div>
          <span className="text-[10px] text-gray-600 block mb-1.5">Anchor Point</span>
          <XYInputs
            x={anchorX}
            y={anchorY}
            onChangeX={(v) => updateTransform('a', v, 0)}
            onChangeY={(v) => updateTransform('a', v, 1)}
            suffix="px"
          />
        </div>

        {/* Scale */}
        <div>
          <span className="text-[10px] text-gray-600 block mb-1.5">
            Scale {isAnimated(transform?.s) && <span className="text-amber-400 ml-1">◆</span>}
          </span>
          <XYInputs
            x={scaleX}
            y={scaleY}
            onChangeX={(v) => updateTransform('s', v, 0)}
            onChangeY={(v) => updateTransform('s', v, 1)}
            suffix="%"
            linked={linkedScale}
            onToggleLink={() => setLinkedScale((v) => !v)}
          />
        </div>

        {/* Rotation */}
        <FieldRow label="Rotation">
          <NumberInput
            value={rotation}
            onChange={(v) => updateTransform('r', v)}
            suffix="°"
            step={0.1}
          />
        </FieldRow>

        {/* Opacity */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gray-600">
              Opacity {isAnimated(transform?.o) && <span className="text-amber-400 ml-1">◆</span>}
            </span>
            <span className="text-[10px] font-mono text-gray-400">{Math.round(opacity)}%</span>
          </div>
          <Slider
            value={[opacity]}
            onValueChange={([v]) => updateTransform('o', v)}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </Section>

      {/* ── Fill Section (Shape layers only) ── */}
      {isShapeLayer && (
        <Section icon={Droplets} title="Fill" defaultOpen={!!fillShape}>
          {fillShape ? (
            <>
              {/* Color picker */}
              <div>
                <span className="text-[10px] text-gray-600 block mb-1.5">Color</span>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={fillColorArr ? lottieColorToHex(fillColorArr) : '#000000'}
                      onChange={(e) => {
                        const lottieColor = hexToLottieColor(e.target.value);
                        if (selectedLayer?.shapes) {
                          const updatedShapes = updateFillColor(selectedLayer.shapes, lottieColor);
                          updateLayerProp('shapes', updatedShapes);
                        }
                      }}
                      className="w-8 h-7 bg-transparent border border-gray-700 rounded cursor-pointer overflow-hidden"
                    />
                  </div>
                  <Input
                    type="text"
                    value={fillColorArr ? lottieColorToHex(fillColorArr) : '#000000'}
                    onChange={(e) => {
                      if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                        const lottieColor = hexToLottieColor(e.target.value);
                        if (selectedLayer?.shapes) {
                          const updatedShapes = updateFillColor(selectedLayer.shapes, lottieColor);
                          updateLayerProp('shapes', updatedShapes);
                        }
                      }
                    }}
                    className="flex-1 h-7 bg-gray-800 border-gray-700 text-gray-300 text-xs font-mono"
                  />
                </div>
              </div>
              {/* Fill opacity */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-gray-600">Opacity</span>
                  <span className="text-[10px] font-mono text-gray-400">{Math.round(fillOpacity)}%</span>
                </div>
                <Slider
                  value={[fillOpacity]}
                  onValueChange={([v]) => {
                    if (selectedLayer?.shapes) {
                      const updatedShapes = updateFillOpacity(selectedLayer.shapes, v);
                      updateLayerProp('shapes', updatedShapes);
                    }
                  }}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </>
          ) : (
            <p className="text-[11px] text-gray-600 italic">No fill found in this layer</p>
          )}
        </Section>
      )}

      {/* ── Stroke Section (Shape layers only) ── */}
      {isShapeLayer && (
        <Section icon={PenLine} title="Stroke" defaultOpen={!!strokeShape}>
          {strokeShape ? (
            <>
              {/* Color */}
              <div>
                <span className="text-[10px] text-gray-600 block mb-1.5">Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={strokeColorArr ? lottieColorToHex(strokeColorArr) : '#ffffff'}
                    onChange={(e) => {
                      const lottieColor = hexToLottieColor(e.target.value);
                      if (selectedLayer?.shapes) {
                        const updatedShapes = updateStrokeColor(selectedLayer.shapes, lottieColor);
                        updateLayerProp('shapes', updatedShapes);
                      }
                    }}
                    className="w-8 h-7 bg-transparent border border-gray-700 rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={strokeColorArr ? lottieColorToHex(strokeColorArr) : '#ffffff'}
                    onChange={(e) => {
                      if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
                        const lottieColor = hexToLottieColor(e.target.value);
                        if (selectedLayer?.shapes) {
                          const updatedShapes = updateStrokeColor(selectedLayer.shapes, lottieColor);
                          updateLayerProp('shapes', updatedShapes);
                        }
                      }
                    }}
                    className="flex-1 h-7 bg-gray-800 border-gray-700 text-gray-300 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Width */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-gray-600">Width</span>
                  <span className="text-[10px] font-mono text-gray-400">{strokeWidth}px</span>
                </div>
                <Slider
                  value={[strokeWidth]}
                  onValueChange={([v]) => {
                    if (selectedLayer?.shapes) {
                      const updatedShapes = updateStrokeWidth(selectedLayer.shapes, v);
                      updateLayerProp('shapes', updatedShapes);
                    }
                  }}
                  min={0}
                  max={50}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Stroke opacity */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[10px] text-gray-600">Opacity</span>
                  <span className="text-[10px] font-mono text-gray-400">{Math.round(strokeOpacity)}%</span>
                </div>
                <Slider
                  value={[strokeOpacity]}
                  onValueChange={([v]) => {
                    if (selectedLayer?.shapes) {
                      const updatedShapes = updateStrokeOpacity(selectedLayer.shapes, v);
                      updateLayerProp('shapes', updatedShapes);
                    }
                  }}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </>
          ) : (
            <p className="text-[11px] text-gray-600 italic">No stroke found in this layer</p>
          )}
        </Section>
      )}

      {/* ── Blend Mode ── */}
      <Section icon={Blend} title="Blending" defaultOpen={false}>
        <FieldRow label="Mode">
          <select
            value={selectedLayer.bm ?? 0}
            onChange={(e) => updateLayerProp('bm', parseInt(e.target.value))}
            className="w-full h-7 bg-gray-800 border border-gray-700 rounded text-gray-300 text-xs px-2 cursor-pointer"
          >
            {Object.entries(BLEND_MODES).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </FieldRow>
      </Section>

      {/* ── Timing Section ── */}
      <Section icon={Clock} title="Timing" defaultOpen={false}>
        <div className="space-y-2">
          <FieldRow label="In Point">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-gray-300">{selectedLayer.ip}</span>
              <span className="text-[10px] text-gray-600">
                f ({animation ? (selectedLayer.ip / animation.fr).toFixed(2) : '—'}s)
              </span>
            </div>
          </FieldRow>
          <FieldRow label="Out Point">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-gray-300">{selectedLayer.op}</span>
              <span className="text-[10px] text-gray-600">
                f ({animation ? (selectedLayer.op / animation.fr).toFixed(2) : '—'}s)
              </span>
            </div>
          </FieldRow>
          <FieldRow label="Start">
            <span className="text-xs font-mono text-gray-300">{selectedLayer.st}</span>
          </FieldRow>
          <FieldRow label="Duration">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-gray-300">
                {selectedLayer.op - selectedLayer.ip}
              </span>
              <span className="text-[10px] text-gray-600">frames</span>
            </div>
          </FieldRow>
        </div>
      </Section>

      {/* ── Layer Info ── */}
      <Section icon={Info} title="Layer Info" defaultOpen={false}>
        <div className="space-y-2">
          <FieldRow label="Index">
            <span className="text-xs font-mono text-gray-300">{selectedLayer.ind}</span>
          </FieldRow>
          {selectedLayer.parent !== undefined && (
            <FieldRow label="Parent">
              <span className="text-xs font-mono text-blue-400">{selectedLayer.parent}</span>
            </FieldRow>
          )}
          <FieldRow label="3D">
            <span className="text-xs font-mono text-gray-300">
              {selectedLayer.ddd === 1 ? 'Yes' : 'No'}
            </span>
          </FieldRow>
          <FieldRow label="Shapes">
            <span className="text-xs font-mono text-gray-300">
              {selectedLayer.shapes?.length ?? 0}
            </span>
          </FieldRow>
          {selectedLayer.sr !== undefined && selectedLayer.sr !== 1 && (
            <FieldRow label="Stretch">
              <span className="text-xs font-mono text-amber-400">{selectedLayer.sr}x</span>
            </FieldRow>
          )}
        </div>
      </Section>

      {/* Bottom padding */}
      <div className="flex-1 min-h-4" />
    </div>
  );
}