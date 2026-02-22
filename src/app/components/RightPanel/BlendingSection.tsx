import { Blend } from 'lucide-react';
import { Section } from './Section';
import { FieldRow } from './FieldRow';
import * as S from '../../../styles/RightPanelStyles';
import { LottieLayer } from '../../../types/lottie';
import { BLEND_MODES } from '../../../utils/lottieConstants';

interface BlendingSectionProps {
  selectedLayer: LottieLayer;
  onUpdateLayerProp: (property: string, value: any) => void;
}

export function BlendingSection({ selectedLayer, onUpdateLayerProp }: BlendingSectionProps) {
  return (
    <Section icon={Blend} title="Blending" defaultOpen={false}>
      <FieldRow label="Mode">
        <S.BlendSelect
          value={selectedLayer.bm ?? 0}
          onChange={(e) => onUpdateLayerProp('bm', parseInt(e.target.value))}
        >
          {Object.entries(BLEND_MODES).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </S.BlendSelect>
      </FieldRow>
    </Section>
  );
}
