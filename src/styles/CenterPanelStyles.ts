import styled from 'styled-components';
import { SelectTrigger, SelectContent } from '../app/components/ui/select';

export const PanelContainer = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.gray950};
  display: flex;
  flex-direction: column;
`;

export const ViewportArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  overflow: auto;
`;

export const EmptyState = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

export const EmptyTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const EmptySubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const CanvasWrapper = styled.div<{ $width: number; $height: number }>`
  position: relative;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray800};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  overflow: hidden;
  background-image: 
    linear-gradient(45deg, #1f2937 25%, transparent 25%),
    linear-gradient(-45deg, #1f2937 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #1f2937 75%),
    linear-gradient(-45deg, transparent 75%, #1f2937 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`;

export const LottieContainer = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

export const SelectionOverlay = styled.div`
  position: absolute;
  inset: 0;
  border: 2px solid ${({ theme }) => theme.colors.blue500};
  pointer-events: none;
`;

export const SelectionCorner = styled.div<{ $position: 'tl' | 'tr' | 'bl' | 'br' }>`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.blue500};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  
  ${({ $position }) => {
    switch ($position) {
      case 'tl': return 'top: -4px; left: -4px;';
      case 'tr': return 'top: -4px; right: -4px;';
      case 'bl': return 'bottom: -4px; left: -4px;';
      case 'br': return 'bottom: -4px; right: -4px;';
    }
  }}
`;

export const ControlsBar = styled.div`
  background-color: ${({ theme }) => theme.colors.gray900};
  border-top: 1px solid ${({ theme }) => theme.colors.gray800};
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const ControlsInner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  max-width: 64rem;
  margin: 0 auto;
`;

export const ControlButton = styled.button<{ $variant?: 'primary' | 'outline' | 'ghost'; $active?: boolean; $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing[1.5]} ${theme.spacing[3]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.DEFAULT};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  ${({ $variant, $active, theme }) => {
    if ($variant === 'primary' || !$variant) {
      return `
        background-color: ${theme.colors.blue600};
        color: ${theme.colors.white};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.blue500};
        }
      `;
    }
    if ($variant === 'outline') {
      if ($active) {
        return `
          background-color: ${theme.colors.blue600};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.blue500};
          }
        `;
      }
      return `
        background-color: ${theme.colors.gray800};
        border: 1px solid ${theme.colors.gray700};
        color: ${theme.colors.gray400};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.gray700};
          color: ${theme.colors.white};
        }
      `;
    }
    if ($variant === 'ghost') {
      return `
        background-color: transparent;
        color: ${theme.colors.gray400};
        &:hover:not(:disabled) {
          background-color: ${theme.colors.gray800};
          color: ${theme.colors.white};
        }
      `;
    }
  }}
`;

export const FrameCounter = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray400};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  min-width: 100px;
`;

export const SliderWrapper = styled.div`
  flex: 1;
`;

export const Divider = styled.div`
  border-left: 1px solid ${({ theme }) => theme.colors.gray700};
  padding-left: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const ZoomLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray400};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  min-width: 45px;
  text-align: center;
`;

export const StyledSelectTrigger = styled(SelectTrigger)`
  width: 100px;
//   height: 32px;
`;

export const StyledSelectContent = styled(SelectContent)`
  /* Content styling handled by select.tsx */
`;
