import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const TourOverlay = styled.div<{ $isCenterPlacement?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${props => props.$isCenterPlacement ? 'rgba(0, 0, 0, 0.5)' : 'transparent'};
  z-index: 9998;
  cursor: pointer;
  transition: background 0.3s ease;
`;

export const TourHighlight = styled.div<{ $top: number; $left: number; $width: number; $height: number; $isVisible: boolean }>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  background: transparent;
  border: 3px solid ${({ theme }) => theme.colors.blue500};
  border-radius: 8px;
  z-index: 10000;
  pointer-events: none;
  opacity: ${props => props.$isVisible ? 1 : 0};
  box-shadow: 
    0 0 0 4px rgba(59, 130, 246, 0.4),
    0 0 0 9999px rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease, opacity 0.3s ease;
`;

export const TourTooltip = styled.div<{ 
  $top: number; 
  $left: number; 
  $placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
}>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  background: ${({ theme }) => theme.colors.gray900};
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  min-width: 320px;
  z-index: 10001;
  cursor: default;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.5),
    0 10px 10px -5px rgba(0, 0, 0, 0.3);
  animation: ${slideUp} 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  ${props => props.$placement === 'center' && `
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `}
`;

export const TooltipHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const TooltipTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.gray100};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.gray400};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.15s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray800};
    color: ${({ theme }) => theme.colors.gray200};
  }
`;

export const TooltipContent = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray300};
  margin: 0 0 20px 0;
`;

export const TooltipFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray400};
  font-weight: 500;
`;

export const ProgressDots = styled.div`
  display: flex;
  gap: 6px;
`;

export const ProgressDot = styled.div<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme, $active }) => 
    $active ? theme.colors.blue500 : theme.colors.gray700};
  transition: all 0.2s ease;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const TourButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'ghost' }>`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  ${({ theme, $variant = 'secondary' }) => {
    if ($variant === 'primary') {
      return `
        background: ${theme.colors.blue600};
        color: white;
        
        &:hover {
          background: ${theme.colors.blue500};
        }
        
        &:active {
          transform: scale(0.98);
        }
      `;
    }
    
    if ($variant === 'ghost') {
      return `
        background: transparent;
        color: ${theme.colors.gray400};
        
        &:hover {
          background: ${theme.colors.gray800};
          color: ${theme.colors.gray200};
        }
      `;
    }
    
    return `
      background: ${theme.colors.gray800};
      color: ${theme.colors.gray200};
      border: 1px solid ${theme.colors.gray700};
      
      &:hover {
        background: ${theme.colors.gray700};
        border-color: ${theme.colors.gray600};
      }
    `;
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TourStartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${({ theme }) => theme.colors.gray800};
  color: ${({ theme }) => theme.colors.gray200};
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray700};
    border-color: ${({ theme }) => theme.colors.blue500};
    color: ${({ theme }) => theme.colors.blue400};
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    flex-shrink: 0;
  }
`;
