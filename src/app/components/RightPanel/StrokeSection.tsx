import { PenLine } from 'lucide-react';
import { Section } from './Section';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import * as S from '../../../styles/RightPanelStyles';
import { LottieLayer } from '../../../types/lottie';
import {
  findStrokeShape,
  getPropValue,
  lottieColorToHex,
  hexToLottieColor,
  updateStrokeColor,
  updateStrokeWidth,
  updateStrokeOpacity,
} from '../../../utils/lottiePropertyUtils';

interface StrokeSectionProps {
  selectedLayer: LottieLayer;
  onUpdateLayerProp: (property: string, value: any) => void;
}

export function StrokeSection({ selectedLayer, onUpdateLayerProp }: StrokeSectionProps) {
  const strokeShape = findStrokeShape(selectedLayer.shapes);
  const strokeColorArr = strokeShape?.c?.a === 0 ? (strokeShape.c.k as number[]) : null;
  const strokeWidth = strokeShape?.w ? getPropValue(strokeShape.w) : 2;
  const strokeOpacity = strokeShape?.o ? getPropValue(strokeShape.o) : 100;

  return (
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
                    onUpdateLayerProp('shapes', updatedShapes);
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
                      onUpdateLayerProp('shapes', updatedShapes);
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
                  onUpdateLayerProp('shapes', updatedShapes);
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
                  onUpdateLayerProp('shapes', updatedShapes);
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
  );
}
