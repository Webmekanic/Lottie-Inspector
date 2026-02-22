import * as S from '../../../styles/RightPanelStyles';

export function EmptyState() {
  return (
    <S.EmptyStateContainer data-tour="right-panel">
      <S.EmptyStateIcon />
      <S.EmptyStateText>
        Select a layer in the panel to inspect and edit its properties
      </S.EmptyStateText>
    </S.EmptyStateContainer>
  );
}
