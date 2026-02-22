import { Clock } from 'lucide-react';
import { Section } from './Section';
import { FieldRow } from './FieldRow';
import * as S from '../../../styles/RightPanelStyles';
import { LottieLayer, LottieAnimation } from '../../../types/lottie';

interface TimingSectionProps {
  selectedLayer: LottieLayer;
  animation: LottieAnimation | null;
}

export function TimingSection({ selectedLayer, animation }: TimingSectionProps) {
  return (
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
  );
}
