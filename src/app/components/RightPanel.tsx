import styled from 'styled-components';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { useEffect, useState, useCallback } from 'react';
import {
  Move,
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

// ── Styled Components ──

const PanelContainer = styled.div`
  width: 300px;
  background-color: ${({ theme }) => theme.colors.gray900};
  border-left: 1px solid ${({ theme }) => theme.colors.gray800};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`;

const EmptyStateContainer = styled.div`
  width: 300px;
  background-color: ${({ theme }) => theme.colors.gray900};
  border-left: 1px solid ${({ theme }) => theme.colors.gray800};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const EmptyStateIcon = styled(Layers)`
  width: ${({ theme }) => theme.spacing[10]};
  height: ${({ theme }) => theme.spacing[10]};
  color: ${({ theme }) => theme.colors.gray700};
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  text-align: center;
  line-height: 1.625;
  padding: 0 ${({ theme }) => theme.spacing[6]};
`;

const LockedStateContainer = styled.div`
  width: 300px;
  background-color: ${({ theme }) => theme.colors.gray900};
  border-left: 1px solid ${({ theme }) => theme.colors.gray800};
  display: flex;
  flex-direction: column;
`;

const LockedStateContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: 0 ${({ theme }) => theme.spacing[6]};
`;

const LockedIconWrapper = styled.div`
  width: ${({ theme }) => theme.spacing[12]};
  height: ${({ theme }) => theme.spacing[12]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LockedIcon = styled.svg`
  width: ${({ theme }) => theme.spacing[6]};
  height: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.amber400};
`;

const LockedTextContainer = styled.div`
  text-align: center;
`;

const LockedTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.amber400};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const LockedDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray500};
  line-height: 1.625;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray800};
  flex-shrink: 0;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const HeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const LayerName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.white};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LayerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[0.5]};
`;

const LayerType = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray500};
`;

const LayerIndex = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray600};
`;

const LayerParent = styled.span`
  font-size: 10px;
  color: rgba(59, 130, 246, 0.7);
`;

const AnimatedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  padding: ${({ theme }) => theme.spacing[0.5]} ${({ theme }) => theme.spacing[1.5]};
  flex-shrink: 0;
`;

const AnimatedDot = styled.div`
  width: ${({ theme }) => theme.spacing[1.5]};
  height: ${({ theme }) => theme.spacing[1.5]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.amber400};
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

const AnimatedText = styled.span`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.amber400};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const SectionContainer = styled.div``;

const SectionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};

  &:hover {
    background-color: rgba(39, 39, 42, 0.4);
  }
`;

const SectionIcon = styled.div`
  width: ${({ theme }) => theme.spacing[3]};
  height: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.gray500};
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const SectionTitle = styled.span`
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.gray500};
  flex: 1;
  text-align: left;
`;

const ChevronIcon = styled.div`
  width: ${({ theme }) => theme.spacing[3]};
  height: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.gray600};

  svg {
    width: 100%;
    height: 100%;
  }
`;

const SectionContent = styled.div`
  padding: 0 ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const PropertyGroup = styled.div``;

const PropertyLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray600};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[1.5]};
`;

const AnimatedIndicator = styled.span`
  color: ${({ theme }) => theme.colors.amber400};
  margin-left: ${({ theme }) => theme.spacing[1]};
`;

const FieldRowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FieldLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray500};
  width: ${({ theme }) => theme.spacing[16]};
  flex-shrink: 0;
`;

const FieldContent = styled.div`
  flex: 1;
`;

const NumberInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const NumberInputSuffix = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.spacing[2]};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray500};
  pointer-events: none;
`;

const XYInputsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1.5]};
`;

const XYInputGroup = styled.div`
  flex: 1;
`;

const XYInputLabel = styled.span`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.gray600};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[0.5]};
  margin-left: ${({ theme }) => theme.spacing[0.5]};
`;

const LinkButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[1]};
  background-color: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray700};
  }
`;

const LinkIcon = styled.div<{ $linked?: boolean }>`
  width: ${({ theme }) => theme.spacing[3]};
  height: ${({ theme }) => theme.spacing[3]};
  color: ${({ $linked, theme }) => 
    $linked ? theme.colors.blue400 : theme.colors.gray600};

  svg {
    width: 100%;
    height: 100%;
  }
`;

const SliderContainer = styled.div``;

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[1.5]};
`;

const SliderLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray600};
`;

const SliderValue = styled.span`
  font-size: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray400};
`;

const ColorInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ColorPicker = styled.input`
  width: ${({ theme }) => theme.spacing[8]};
  height: ${({ theme }) => theme.spacing[8]};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  cursor: pointer;
  overflow: hidden;
`;

const EmptyMessage = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray600};
  font-style: italic;
`;

const BlendSelect = styled.select`
  width: 100%;
  height: ${({ theme }) => theme.spacing[8]};
  background-color: ${({ theme }) => theme.colors.gray800};
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  padding: 0 ${({ theme }) => theme.spacing[2]};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue500};
  }
`;

const InfoRowsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const InfoValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray300};
`;

const InfoValueHighlight = styled(InfoValue)`
  color: ${({ theme }) => theme.colors.blue400};
`;

const InfoValueWarning = styled(InfoValue)`
  color: ${({ theme }) => theme.colors.amber400};
`;

const TimingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1.5]};
`;

const TimingValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray300};
`;

const TimingUnit = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray600};
`;

const Spacer = styled.div`
  flex: 1;
  min-height: ${({ theme }) => theme.spacing[4]};
`;

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
    <SectionContainer>
      <SectionButton onClick={() => setOpen((v) => !v)}>
        <SectionIcon>
          <Icon />
        </SectionIcon>
        <SectionTitle>{title}</SectionTitle>
        <ChevronIcon>
          {open ? <ChevronDown /> : <ChevronRight />}
        </ChevronIcon>
      </SectionButton>
      {open && <SectionContent>{children}</SectionContent>}
      <Separator className="bg-gray-800" />
    </SectionContainer>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <FieldRowContainer>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>{children}</FieldContent>
    </FieldRowContainer>
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
    <NumberInputWrapper>
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
      {suffix && <NumberInputSuffix>{suffix}</NumberInputSuffix>}
    </NumberInputWrapper>
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
    <XYInputsContainer>
      <XYInputGroup>
        <XYInputLabel>{labelX}</XYInputLabel>
        <NumberInput
          value={x}
          onChange={(v) => {
            onChangeX(v);
            if (linked) onChangeY(v);
          }}
          suffix={suffix}
        />
      </XYInputGroup>
      {onToggleLink && (
        <LinkButton
          onClick={onToggleLink}
          title={linked ? 'Unlink X/Y' : 'Link X/Y'}
        >
          <LinkIcon $linked={linked}>
            {linked ? <Link2 /> : <Unlink2 />}
          </LinkIcon>
        </LinkButton>
      )}
      <XYInputGroup>
        <XYInputLabel>{labelY}</XYInputLabel>
        <NumberInput
          value={y}
          onChange={(v) => {
            onChangeY(v);
            if (linked) onChangeX(v);
          }}
          suffix={suffix}
        />
      </XYInputGroup>
    </XYInputsContainer>
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
      <EmptyStateContainer>
        <EmptyStateIcon />
        <EmptyStateText>
          Select a layer in the panel to inspect and edit its properties
        </EmptyStateText>
      </EmptyStateContainer>
    );
  }

  const layerTypeLabel = LAYER_TYPE_LABELS[selectedLayer.ty] ?? 'Unknown';
  const isShapeLayer = selectedLayer.ty === 4;
  const isAnimated = (prop: any) => prop?.a === 1;
  const isLocked = selectedLayer.locked === true;

  if (isLocked) {
    return (
      <LockedStateContainer>
        <Header>
          <HeaderContent>
            <HeaderInfo>
              <LayerName>
                {selectedLayer.nm || `Layer ${selectedLayerIndex}`}
              </LayerName>
              <LayerMeta>
                <LayerType>{layerTypeLabel} Layer</LayerType>
                <LayerIndex>#{selectedLayer.ind}</LayerIndex>
              </LayerMeta>
            </HeaderInfo>
          </HeaderContent>
        </Header>
        
        <LockedStateContent>
          <LockedIconWrapper>
            <LockedIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </LockedIcon>
          </LockedIconWrapper>
          <LockedTextContainer>
            <LockedTitle>Layer is Locked</LockedTitle>
            <LockedDescription>
              This layer cannot be edited. Click the lock icon in the layer panel to unlock it.
            </LockedDescription>
          </LockedTextContainer>
        </LockedStateContent>
      </LockedStateContainer>
    );
  }

  return (
    <PanelContainer>
      <Header>
        <HeaderContent>
          <HeaderInfo>
            <LayerName>
              {selectedLayer.nm || `Layer ${selectedLayerIndex}`}
            </LayerName>
            <LayerMeta>
              <LayerType>{layerTypeLabel} Layer</LayerType>
              <LayerIndex>#{selectedLayer.ind}</LayerIndex>
              {selectedLayer.parent !== undefined && (
                <LayerParent>↳ {selectedLayer.parent}</LayerParent>
              )}
            </LayerMeta>
          </HeaderInfo>
          {(isAnimated(transform?.p) || isAnimated(transform?.r) || isAnimated(transform?.s)) && (
            <AnimatedBadge>
              <AnimatedDot />
              <AnimatedText>Animated</AnimatedText>
            </AnimatedBadge>
          )}
        </HeaderContent>
      </Header>
      <Section icon={Move} title="Transform">
        <PropertyGroup>
          <PropertyLabel>
            Position {isAnimated(transform?.p) && <AnimatedIndicator>◆</AnimatedIndicator>}
          </PropertyLabel>
          <XYInputs
            x={posX}
            y={posY}
            onChangeX={(v) => updateTransform('p', v, 0)}
            onChangeY={(v) => updateTransform('p', v, 1)}
            suffix="px"
          />
        </PropertyGroup>
        <PropertyGroup>
          <PropertyLabel>Anchor Point</PropertyLabel>
          <XYInputs
            x={anchorX}
            y={anchorY}
            onChangeX={(v) => updateTransform('a', v, 0)}
            onChangeY={(v) => updateTransform('a', v, 1)}
            suffix="px"
          />
        </PropertyGroup>
        <PropertyGroup>
          <PropertyLabel>
            Scale {isAnimated(transform?.s) && <AnimatedIndicator>◆</AnimatedIndicator>}
          </PropertyLabel>
          <XYInputs
            x={scaleX}
            y={scaleY}
            onChangeX={(v) => updateTransform('s', v, 0)}
            onChangeY={(v) => updateTransform('s', v, 1)}
            suffix="%"
            linked={linkedScale}
            onToggleLink={() => setLinkedScale((v) => !v)}
          />
        </PropertyGroup>
        <FieldRow label="Rotation">
          <NumberInput
            value={rotation}
            onChange={(v) => updateTransform('r', v)}
            suffix="°"
            step={0.1}
          />
        </FieldRow>
        <SliderContainer>
          <SliderHeader>
            <SliderLabel>
              Opacity {isAnimated(transform?.o) && <AnimatedIndicator>◆</AnimatedIndicator>}
            </SliderLabel>
            <SliderValue>{Math.round(opacity)}%</SliderValue>
          </SliderHeader>
          <Slider
            value={[opacity]}
            onValueChange={([v]) => updateTransform('o', v)}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </SliderContainer>
      </Section>
      {isShapeLayer && (
        <Section icon={Droplets} title="Fill" defaultOpen={!!fillShape}>
          {fillShape ? (
            <>
              <PropertyGroup>
                <PropertyLabel>Color</PropertyLabel>
                <ColorInputContainer>
                  <ColorPicker
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
                </ColorInputContainer>
              </PropertyGroup>
              <SliderContainer>
                <SliderHeader>
                  <SliderLabel>Opacity</SliderLabel>
                  <SliderValue>{Math.round(fillOpacity)}%</SliderValue>
                </SliderHeader>
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
              </SliderContainer>
            </>
          ) : (
            <EmptyMessage>No fill found in this layer</EmptyMessage>
          )}
        </Section>
      )}
      {isShapeLayer && (
        <Section icon={PenLine} title="Stroke" defaultOpen={!!strokeShape}>
          {strokeShape ? (
            <>
              <PropertyGroup>
                <PropertyLabel>Color</PropertyLabel>
                <ColorInputContainer>
                  <ColorPicker
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
                </ColorInputContainer>
              </PropertyGroup>
              <SliderContainer>
                <SliderHeader>
                  <SliderLabel>Width</SliderLabel>
                  <SliderValue>{strokeWidth}px</SliderValue>
                </SliderHeader>
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
              </SliderContainer>
              <SliderContainer>
                <SliderHeader>
                  <SliderLabel>Opacity</SliderLabel>
                  <SliderValue>{Math.round(strokeOpacity)}%</SliderValue>
                </SliderHeader>
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
              </SliderContainer>
            </>
          ) : (
            <EmptyMessage>No stroke found in this layer</EmptyMessage>
          )}
        </Section>
      )}
      <Section icon={Blend} title="Blending" defaultOpen={false}>
        <FieldRow label="Mode">
          <BlendSelect
            value={selectedLayer.bm ?? 0}
            onChange={(e) => updateLayerProp('bm', parseInt(e.target.value))}
          >
            {Object.entries(BLEND_MODES).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </BlendSelect>
        </FieldRow>
      </Section>
      <Section icon={Clock} title="Timing" defaultOpen={false}>
        <InfoRowsContainer>
          <FieldRow label="In Point">
            <TimingInfo>
              <TimingValue>{selectedLayer.ip}</TimingValue>
              <TimingUnit>
                f ({animation ? (selectedLayer.ip / animation.fr).toFixed(2) : '—'}s)
              </TimingUnit>
            </TimingInfo>
          </FieldRow>
          <FieldRow label="Out Point">
            <TimingInfo>
              <TimingValue>{selectedLayer.op}</TimingValue>
              <TimingUnit>
                f ({animation ? (selectedLayer.op / animation.fr).toFixed(2) : '—'}s)
              </TimingUnit>
            </TimingInfo>
          </FieldRow>
          <FieldRow label="Start">
            <InfoValue>{selectedLayer.st}</InfoValue>
          </FieldRow>
          <FieldRow label="Duration">
            <TimingInfo>
              <TimingValue>
                {selectedLayer.op - selectedLayer.ip}
              </TimingValue>
              <TimingUnit>frames</TimingUnit>
            </TimingInfo>
          </FieldRow>
        </InfoRowsContainer>
      </Section>
      <Section icon={Info} title="Layer Info" defaultOpen={false}>
        <InfoRowsContainer>
          <FieldRow label="Index">
            <InfoValue>{selectedLayer.ind}</InfoValue>
          </FieldRow>
          {selectedLayer.parent !== undefined && (
            <FieldRow label="Parent">
              <InfoValueHighlight>{selectedLayer.parent}</InfoValueHighlight>
            </FieldRow>
          )}
          <FieldRow label="3D">
            <InfoValue>
              {selectedLayer.ddd === 1 ? 'Yes' : 'No'}
            </InfoValue>
          </FieldRow>
          <FieldRow label="Shapes">
            <InfoValue>
              {selectedLayer.shapes?.length ?? 0}
            </InfoValue>
          </FieldRow>
          {selectedLayer.sr !== undefined && selectedLayer.sr !== 1 && (
            <FieldRow label="Stretch">
              <InfoValueWarning>{selectedLayer.sr}x</InfoValueWarning>
            </FieldRow>
          )}
        </InfoRowsContainer>
      </Section>
      <Spacer />
    </PanelContainer>
  );
}
