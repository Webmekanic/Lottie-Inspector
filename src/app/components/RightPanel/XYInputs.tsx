import * as S from '../../../styles/RightPanelStyles';
import { NumberInput } from './NumberInput';
import { Link2, Unlink2 } from 'lucide-react';

interface XYInputsProps {
  labelX?: string;
  labelY?: string;
  x: number;
  y: number;
  onChangeX: (v: number) => void;
  onChangeY: (v: number) => void;
  suffix?: string;
  linked?: boolean;
  onToggleLink?: () => void;
}

export function XYInputs({
  labelX = 'X',
  labelY = 'Y',
  x,
  y,
  onChangeX,
  onChangeY,
  suffix,
  linked,
  onToggleLink,
}: XYInputsProps) {
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
