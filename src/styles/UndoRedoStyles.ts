import styled from 'styled-components';

export const UndoRedoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  background: ${({ theme }) => theme.colors.gray900};
  border: 1px solid ${({ theme }) => theme.colors.gray800};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 2px;
`;

interface UndoRedoButtonProps {
  $disabled?: boolean;
}

export const UndoRedoButton = styled.button<UndoRedoButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme, $disabled }) => 
    $disabled ? theme.colors.gray600 : theme.colors.gray400};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  transition: all ${({ theme }) => theme.transitions.DEFAULT};
  position: relative;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.gray850};
    color: ${({ theme }) => theme.colors.gray200};
  }
  
  &:active:not(:disabled) {
    background: ${({ theme }) => theme.colors.gray700};
    color: ${({ theme }) => theme.colors.gray100};
    transform: scale(0.95);
  }
  
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue500};
    outline-offset: 1px;
  }
  
  &:disabled {
    opacity: 0.4;
  }

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2;
  }
`;

export const Tooltip = styled.div`
  position: absolute;
  bottom: -36px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.gray800};
  color: ${({ theme }) => theme.colors.gray200};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  padding: ${({ theme }) => theme.spacing[1.5]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  z-index: 1000;
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  
  ${UndoRedoButton}:hover & {
    opacity: 1;
  }
`;

export const TooltipShortcut = styled.span`
  color: ${({ theme }) => theme.colors.gray400};
  margin-left: ${({ theme }) => theme.spacing[2]};
`;

export const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: ${({ theme }) => theme.colors.gray800};
  margin: 0 2px;
`;
