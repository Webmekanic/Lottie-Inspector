import { Info } from 'lucide-react';
import { Section } from './Section';
import { FieldRow } from './FieldRow';
import * as S from '../../../styles/RightPanelStyles';
import { LottieLayer } from '../../../types/lottie';

interface LayerInfoSectionProps {
  selectedLayer: LottieLayer;
}

export function LayerInfoSection({ selectedLayer }: LayerInfoSectionProps) {
  return (
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
  );
}
