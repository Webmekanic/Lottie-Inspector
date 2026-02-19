import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import * as S from '../../styles/RightPanelStyles';
import { useEffect, useState, useCallback } from 'react';
import {
  Move,
  Droplets,
  PenLine,
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

interface RightPanelProps {
  selectedLayer: LottieLayer | null;
  selectedLayerIndex: number | null;
  animation: LottieAnimation | null;
  /** Wire directly to XState: send(event) */
  onSend: (event: LottieEvent) => void;
}

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
    if (Array.isArray(prop.k)) return index !== undefined ? (prop.k[index] ?? 0) : prop.k[0] ?? 0;
    return typeof prop.k === 'number' ? prop.k : 0;
  }
  if (Array.isArray(prop.k) && prop.k.length > 0) {
    const kf = prop.k[0];
    if (kf.s) return index !== undefined ? (kf.s[index] ?? 0) : kf.s[0] ?? 0;
  }
  return 0;
}

/** Build an updated animated property preserving animation flag */
function buildUpdatedProp(existing: any, newValue: number, index?: number): any {
  if (!existing) {
    // If property doesn't exist, create it with proper defaults
    if (index !== undefined) {
      const arr = [100, 100, 100]; // Default for position/scale/anchor
      arr[index] = newValue;
      return { a: 0, k: arr };
    }
    return { a: 0, k: newValue };
  }
  
  if (existing.a === 0) {
    // Non-animated property
    if (index !== undefined) {
      // Preserve existing array structure or use proper defaults
      let arr: number[];
      if (Array.isArray(existing.k)) {
        arr = [...existing.k];
        // Ensure array has at least 3 elements for proper structure
        while (arr.length < 3) {
          arr.push(100);
        }
      } else {
        // Default for multi-value properties (position, scale, anchor)
        arr = [100, 100, 100];
      }
      arr[index] = newValue;
      return { ...existing, k: arr };
    }
    return { ...existing, k: newValue };
  }
  
  // Animated — update start value of first keyframe only (non-destructive)
  if (!existing.k || !Array.isArray(existing.k) || existing.k.length === 0) {
    // Invalid or missing keyframes, create a proper default
    const defaultValue = index !== undefined ? [100, 100, 100] : [newValue];
    if (index !== undefined) {
      defaultValue[index] = newValue;
    }
    return { ...existing, k: [{ t: 0, s: defaultValue }] };
  }
  
  const keyframes = JSON.parse(JSON.stringify(existing.k));
  if (keyframes[0]) {
    if (index !== undefined) {
      // Preserve existing array or use proper defaults
      if (Array.isArray(keyframes[0].s)) {
        keyframes[0].s = [...keyframes[0].s];
        // Ensure array has at least 3 elements
        while (keyframes[0].s.length < 3) {
          keyframes[0].s.push(100);
        }
      } else {
        keyframes[0].s = [100, 100, 100];
      }
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

// ── Components ──

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
    <S.SectionContainer>
      <S.SectionButton onClick={() => setOpen((v) => !v)}>
        <S.SectionIcon>
          <Icon />
        </S.SectionIcon>
        <S.SectionTitle>{title}</S.SectionTitle>
        <S.ChevronIcon>
          {open ? <ChevronDown /> : <ChevronRight />}
        </S.ChevronIcon>
      </S.SectionButton>
      {open && <S.SectionContent>{children}</S.SectionContent>}
      <Separator className="bg-gray-800" />
    </S.SectionContainer>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <S.FieldRowContainer>
      <S.FieldLabel>{label}</S.FieldLabel>
      <S.FieldContent>{children}</S.FieldContent>
    </S.FieldRowContainer>
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
    <S.NumberInputWrapper>
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
      {suffix && <S.NumberInputSuffix>{suffix}</S.NumberInputSuffix>}
    </S.NumberInputWrapper>
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
    <S.XYInputsContainer>
      <S.XYInputGroup>
        <S.XYInputLabel>{labelX}</S.XYInputLabel>
        <NumberInput
          value={x}
          onChange={(v) => {
            onChangeX(v);
            if (linked) onChangeY(v);
          }}
          suffix={suffix}
        />
      </S.XYInputGroup>
      {onToggleLink && (
        <S.LinkButton
          onClick={onToggleLink}
          title={linked ? 'Unlink X/Y' : 'Link X/Y'}
        >
          <S.LinkIcon $linked={linked}>
            {linked ? <Link2 /> : <Unlink2 />}
          </S.LinkIcon>
        </S.LinkButton>
      )}
      <S.XYInputGroup>
        <S.XYInputLabel>{labelY}</S.XYInputLabel>
        <NumberInput
          value={y}
          onChange={(v) => {
            onChangeY(v);
            if (linked) onChangeX(v);
          }}
          suffix={suffix}
        />
      </S.XYInputGroup>
    </S.XYInputsContainer>
  );
}

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
  const fillShape = findFillShape(selectedLayer?.shapes);
  const strokeShape = findStrokeShape(selectedLayer?.shapes);
  const fillColorArr = fillShape?.c?.a === 0 ? (fillShape.c.k as number[]) : null;
  const fillOpacity = fillShape?.o ? getPropValue(fillShape.o) : 100;
  const strokeColorArr = strokeShape?.c?.a === 0 ? (strokeShape.c.k as number[]) : null;
  const strokeWidth = strokeShape?.w ? getPropValue(strokeShape.w) : 2;
  const strokeOpacity = strokeShape?.o ? getPropValue(strokeShape.o) : 100;

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

  if (!selectedLayer || selectedLayerIndex === null) {
    return (
      <S.EmptyStateContainer>
        <S.EmptyStateIcon />
        <S.EmptyStateText>
          Select a layer in the panel to inspect and edit its properties
        </S.EmptyStateText>
      </S.EmptyStateContainer>
    );
  }

  const layerTypeLabel = LAYER_TYPE_LABELS[selectedLayer.ty] ?? 'Unknown';
  const isShapeLayer = selectedLayer.ty === 4;
  const isAnimated = (prop: any) => prop?.a === 1;
  const isLocked = selectedLayer.locked === true;

  if (isLocked) {
    return (
      <S.LockedStateContainer>
        <S.Header>
          <S.HeaderContent>
            <S.HeaderInfo>
              <S.LayerName>
                {`Layer ${selectedLayer.nm || selectedLayerIndex}`}
              </S.LayerName>
              <S.LayerMeta>
                <S.LayerType>{layerTypeLabel} Layer</S.LayerType>
                <S.LayerIndex>#{selectedLayer.ind}</S.LayerIndex>
              </S.LayerMeta>
            </S.HeaderInfo>
          </S.HeaderContent>
        </S.Header>
        
        <S.LockedStateContent>
          <S.LockedIconWrapper>
            <S.LockedIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </S.LockedIcon>
          </S.LockedIconWrapper>
          <S.LockedTextContainer>
            <S.LockedTitle>Layer is Locked</S.LockedTitle>
            <S.LockedDescription>
              This layer cannot be edited. Click the lock icon in the layer panel to unlock it.
            </S.LockedDescription>
          </S.LockedTextContainer>
        </S.LockedStateContent>
      </S.LockedStateContainer>
    );
  }

  return (
    <S.PanelContainer data-tour="right-panel">
      <S.Header>
        <S.HeaderContent>
          <S.HeaderInfo>
            <S.LayerName>
              {`Layer ${selectedLayer.nm || selectedLayerIndex}`}
            </S.LayerName>
            <S.LayerMeta>
              <S.LayerType>{layerTypeLabel} Layer</S.LayerType>
              <S.LayerIndex>#{selectedLayer.ind}</S.LayerIndex>
              {selectedLayer.parent !== undefined && (
                <S.LayerParent>↳ {selectedLayer.parent}</S.LayerParent>
              )}
            </S.LayerMeta>
          </S.HeaderInfo>
          {(isAnimated(transform?.p) || isAnimated(transform?.r) || isAnimated(transform?.s)) && (
            <S.AnimatedBadge>
              <S.AnimatedDot />
              <S.AnimatedText>Animated</S.AnimatedText>
            </S.AnimatedBadge>
          )}
        </S.HeaderContent>
      </S.Header>
      <Section icon={Move} title="Transform">
        <S.PropertyGroup>
          <S.PropertyLabel>
            Position {isAnimated(transform?.p) && <S.AnimatedIndicator>◆</S.AnimatedIndicator>}
          </S.PropertyLabel>
          <XYInputs
            x={posX}
            y={posY}
            onChangeX={(v) => updateTransform('p', v, 0)}
            onChangeY={(v) => updateTransform('p', v, 1)}
            suffix="px"
          />
        </S.PropertyGroup>
        <S.PropertyGroup>
          <S.PropertyLabel>Anchor Point</S.PropertyLabel>
          <XYInputs
            x={anchorX}
            y={anchorY}
            onChangeX={(v) => updateTransform('a', v, 0)}
            onChangeY={(v) => updateTransform('a', v, 1)}
            suffix="px"
          />
        </S.PropertyGroup>
        <S.PropertyGroup>
          <S.PropertyLabel>
            Scale {isAnimated(transform?.s) && <S.AnimatedIndicator>◆</S.AnimatedIndicator>}
          </S.PropertyLabel>
          <XYInputs
            x={scaleX}
            y={scaleY}
            onChangeX={(v) => updateTransform('s', v, 0)}
            onChangeY={(v) => updateTransform('s', v, 1)}
            suffix="%"
            linked={linkedScale}
            onToggleLink={() => setLinkedScale((v) => !v)}
          />
        </S.PropertyGroup>
        <FieldRow label="Rotation">
          <NumberInput
            value={rotation}
            onChange={(v) => updateTransform('r', v)}
            suffix="°"
            step={0.1}
          />
        </FieldRow>
        <S.SliderContainer>
          <S.SliderHeader>
            <S.SliderLabel>
              Opacity {isAnimated(transform?.o) && <S.AnimatedIndicator>◆</S.AnimatedIndicator>}
            </S.SliderLabel>
            <S.SliderValue>{Math.round(opacity)}%</S.SliderValue>
          </S.SliderHeader>
          <Slider
            value={[opacity]}
            onValueChange={([v]) => updateTransform('o', v)}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </S.SliderContainer>
      </Section>
      {isShapeLayer && (
        <Section icon={Droplets} title="Fill" defaultOpen={!!fillShape}>
          {fillShape ? (
            <>
              <S.PropertyGroup>
                <S.PropertyLabel>Color</S.PropertyLabel>
                <S.ColorInputContainer>
                  <S.ColorPicker
                    type="color"
                    value={fillColorArr ? lottieColorToHex(fillColorArr) : '#000000'}
                    onChange={(e) => {
                      const lottieColor = hexToLottieColor(e.target.value);
                      if (selectedLayer?.shapes) {
                        const updatedShapes = updateFillColor(selectedLayer.shapes, lottieColor);
                        updateLayerProp('shapes', updatedShapes);
                      }
                    }}
                  />
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
                </S.ColorInputContainer>
              </S.PropertyGroup>
              <S.SliderContainer>
                <S.SliderHeader>
                  <S.SliderLabel>Opacity</S.SliderLabel>
                  <S.SliderValue>{Math.round(fillOpacity)}%</S.SliderValue>
                </S.SliderHeader>
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
              </S.SliderContainer>
            </>
          ) : (
            <S.EmptyMessage>No fill found in this layer</S.EmptyMessage>
          )}
        </Section>
      )}
      {isShapeLayer && (
        <Section icon={PenLine} title="Stroke" defaultOpen={!!strokeShape}>
          {strokeShape ? (
            <>
              <S.PropertyGroup>
                <S.PropertyLabel>Color</S.PropertyLabel>
                <S.ColorInputContainer>
                  <S.ColorPicker
                    type="color"
                    value={strokeColorArr ? lottieColorToHex(strokeColorArr) : '#ffffff'}
                    onChange={(e) => {
                      const lottieColor = hexToLottieColor(e.target.value);
                      if (selectedLayer?.shapes) {
                        const updatedShapes = updateStrokeColor(selectedLayer.shapes, lottieColor);
                        updateLayerProp('shapes', updatedShapes);
                      }
                    }}
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
                </S.ColorInputContainer>
              </S.PropertyGroup>
              <S.SliderContainer>
                <S.SliderHeader>
                  <S.SliderLabel>Width</S.SliderLabel>
                  <S.SliderValue>{strokeWidth}px</S.SliderValue>
                </S.SliderHeader>
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
              </S.SliderContainer>
              <S.SliderContainer>
                <S.SliderHeader>
                  <S.SliderLabel>Opacity</S.SliderLabel>
                  <S.SliderValue>{Math.round(strokeOpacity)}%</S.SliderValue>
                </S.SliderHeader>
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
              </S.SliderContainer>
            </>
          ) : (
            <S.EmptyMessage>No stroke found in this layer</S.EmptyMessage>
          )}
        </Section>
      )}
      <Section icon={Blend} title="Blending" defaultOpen={false}>
        <FieldRow label="Mode">
          <S.BlendSelect
            value={selectedLayer.bm ?? 0}
            onChange={(e) => updateLayerProp('bm', parseInt(e.target.value))}
          >
            {Object.entries(BLEND_MODES).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </S.BlendSelect>
        </FieldRow>
      </Section>
      <Section icon={Clock} title="Timing" defaultOpen={false}>
        <S.InfoRowsContainer>
          <FieldRow label="In Point">
            <S.TimingInfo>
              <S.TimingValue>{selectedLayer.ip}</S.TimingValue>
              <S.TimingUnit>
                f ({animation ? (selectedLayer.ip / animation.fr).toFixed(2) : '—'}s)
              </S.TimingUnit>
            </S.TimingInfo>
          </FieldRow>
          <FieldRow label="Out Point">
            <S.TimingInfo>
              <S.TimingValue>{selectedLayer.op}</S.TimingValue>
              <S.TimingUnit>
                f ({animation ? (selectedLayer.op / animation.fr).toFixed(2) : '—'}s)
              </S.TimingUnit>
            </S.TimingInfo>
          </FieldRow>
          <FieldRow label="Start">
            <S.InfoValue>{selectedLayer.st}</S.InfoValue>
          </FieldRow>
          <FieldRow label="Duration">
            <S.TimingInfo>
              <S.TimingValue>
                {selectedLayer.op - selectedLayer.ip}
              </S.TimingValue>
              <S.TimingUnit>frames</S.TimingUnit>
            </S.TimingInfo>
          </FieldRow>
        </S.InfoRowsContainer>
      </Section>
      <Section icon={Info} title="Layer Info" defaultOpen={false}>
        <S.InfoRowsContainer>
          <FieldRow label="Index">
            <S.InfoValue>{selectedLayer.ind}</S.InfoValue>
          </FieldRow>
          {selectedLayer.parent !== undefined && (
            <FieldRow label="Parent">
              <S.InfoValueHighlight>{selectedLayer.parent}</S.InfoValueHighlight>
            </FieldRow>
          )}
          <FieldRow label="3D">
            <S.InfoValue>
              {selectedLayer.ddd === 1 ? 'Yes' : 'No'}
            </S.InfoValue>
          </FieldRow>
          <FieldRow label="Shapes">
            <S.InfoValue>
              {selectedLayer.shapes?.length ?? 0}
            </S.InfoValue>
          </FieldRow>
          {selectedLayer.sr !== undefined && selectedLayer.sr !== 1 && (
            <FieldRow label="Stretch">
              <S.InfoValueWarning>{selectedLayer.sr}x</S.InfoValueWarning>
            </FieldRow>
          )}
        </S.InfoRowsContainer>
      </Section>
      <S.Spacer />
    </S.PanelContainer>
  );
}