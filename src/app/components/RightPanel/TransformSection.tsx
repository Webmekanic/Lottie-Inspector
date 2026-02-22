import { useState } from 'react';
import { Move } from 'lucide-react';
import { Section } from './Section';
import { FieldRow } from './FieldRow';
import { NumberInput } from './NumberInput';
import { XYInputs } from './XYInputs';
import { Slider } from '../ui/slider';
import * as S from '../../../styles/RightPanelStyles';
import { LottieLayer } from '../../../types/lottie';
import { getPropValue } from '../../../utils/lottiePropertyUtils';

interface TransformSectionProps {
  selectedLayer: LottieLayer;
  onUpdateTransform: (key: 'p' | 's' | 'r' | 'o' | 'a', newValue: number, index?: number) => void;
}

export function TransformSection({ selectedLayer, onUpdateTransform }: TransformSectionProps) {
  const [linkedScale, setLinkedScale] = useState(false);

  const transform = selectedLayer.ks;
  const posX = getPropValue(transform?.p, 0);
  const posY = getPropValue(transform?.p, 1);
  const scaleX = getPropValue(transform?.s, 0);
  const scaleY = getPropValue(transform?.s, 1);
  const anchorX = getPropValue(transform?.a, 0);
  const anchorY = getPropValue(transform?.a, 1);
  const rotation = getPropValue(transform?.r);
  const opacity = getPropValue(transform?.o);

  const isAnimated = (prop: any) => prop?.a === 1;

  return (
    <Section icon={Move} title="Transform">
      <S.PropertyGroup>
        <S.PropertyLabel>
          Position {isAnimated(transform?.p) && <S.AnimatedIndicator>◆</S.AnimatedIndicator>}
        </S.PropertyLabel>
        <XYInputs
          x={posX}
          y={posY}
          onChangeX={(v) => onUpdateTransform('p', v, 0)}
          onChangeY={(v) => onUpdateTransform('p', v, 1)}
          suffix="px"
        />
      </S.PropertyGroup>
      <S.PropertyGroup>
        <S.PropertyLabel>Anchor Point</S.PropertyLabel>
        <XYInputs
          x={anchorX}
          y={anchorY}
          onChangeX={(v) => onUpdateTransform('a', v, 0)}
          onChangeY={(v) => onUpdateTransform('a', v, 1)}
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
          onChangeX={(v) => onUpdateTransform('s', v, 0)}
          onChangeY={(v) => onUpdateTransform('s', v, 1)}
          suffix="%"
          linked={linkedScale}
          onToggleLink={() => setLinkedScale((v) => !v)}
        />
      </S.PropertyGroup>
      <FieldRow label="Rotation">
        <NumberInput
          value={rotation}
          onChange={(v) => onUpdateTransform('r', v)}
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
          onValueChange={([v]) => onUpdateTransform('o', v)}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </S.SliderContainer>
    </Section>
  );
}
