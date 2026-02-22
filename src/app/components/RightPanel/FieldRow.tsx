import * as S from '../../../styles/RightPanelStyles';

interface FieldRowProps {
  label: string;
  children: React.ReactNode;
}

export function FieldRow({ label, children }: FieldRowProps) {
  return (
    <S.FieldRowContainer>
      <S.FieldLabel>{label}</S.FieldLabel>
      <S.FieldContent>{children}</S.FieldContent>
    </S.FieldRowContainer>
  );
}
