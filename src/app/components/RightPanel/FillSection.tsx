import { Droplets } from 'lucide-react';
import { Section } from './Section';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import * as S from '../../../styles/RightPanelStyles';
import { LottieLayer } from '../../../types/lottie';
import {
  findFillShape,
  getPropValue,
  lottieColorToHex,
  hexToLottieColor,
  updateFillColor,
  updateFillOpacity,
} from '../../../utils/lottiePropertyUtils';

interface FillSectionProps {
  selectedLayer: LottieLayer;
  onUpdateLayerProp: (property: string, value: any) => void;
}

export function FillSection({ selectedLayer, onUpdateLayerProp }: FillSectionProps) {
  const fillShape = findFillShape(selectedLayer.shapes);
  const fillColorArr = fillShape?.c?.a === 0 ? (fillShape.c.k as number[]) : null;
  const fillOpacity = fillShape?.o ? getPropValue(fillShape.o) : 100;

  return (
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
                    onUpdateLayerProp('shapes', updatedShapes);
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
              <S.SliderLabel>Opacity</S.SliderLabel>
              <S.SliderValue>{Math.round(fillOpacity)}%</S.SliderValue>
            </S.SliderHeader>
            <Slider
              value={[fillOpacity]}
              onValueChange={([v]) => {
                if (selectedLayer?.shapes) {
                  const updatedShapes = updateFillOpacity(selectedLayer.shapes, v);
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
        <S.EmptyMessage>No fill found in this layer</S.EmptyMessage>
      )}
    </Section>
  );
}
