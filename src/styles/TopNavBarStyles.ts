import styled from 'styled-components';

export const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.gray950};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray800};
  height: 56px;
  flex-shrink: 0;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  flex: 1;
  min-width: 0;
`;

export const MiddleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-shrink: 0;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-shrink: 0;
`;

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-shrink: 0;
`;

export const Logo = styled.div`
  width: ${({ theme }) => theme.spacing[8]};
  height: ${({ theme }) => theme.spacing[8]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.blue500}, ${({ theme }) => theme.colors.purple500});
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const LogoText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.white};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray100};
  letter-spacing: -0.025em;
`;

export const FileName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray500};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HiddenInput = styled.input`
  display: none;
`;

interface StyledButtonProps {
  $variant?: 'primary' | 'outline' | 'ghost';
  $disabled?: boolean;
}

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.DEFAULT};
  border: 1px solid transparent;
  outline: none;
  flex-shrink: 0;
  white-space: nowrap;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};

  & svg {
    pointer-events: none;
    flex-shrink: 0;
  }

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.blue500};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.blue600};
          }
        `;
      case 'outline':
        return `
          background-color: ${theme.colors.gray900};
          color: ${theme.colors.gray100};
          border-color: ${theme.colors.gray700};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray800};
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: ${theme.colors.gray400};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray800};
            color: ${theme.colors.gray100};
          }
        `;
      default:
        return `
          background-color: ${theme.colors.gray800};
          color: ${theme.colors.gray100};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray700};
          }
        `;
    }
  }}
`;

export const RenderModeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[1.5]} ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.gray900};
  border: 1px solid ${({ theme }) => theme.colors.gray800};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

interface ModeLabelProps {
  $active?: boolean;
}

export const ModeLabel = styled.span<ModeLabelProps>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ $active, theme }) => $active ? theme.colors.blue400 : theme.colors.gray500};
  transition: color ${({ theme }) => theme.transitions.DEFAULT};
`;

export const FpsBadge = styled.div`
  padding: ${({ theme }) => theme.spacing[1.5]} ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.gray900};
  border: 1px solid ${({ theme }) => theme.colors.gray800};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray400};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
`;

export const ThemeToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing[9]};
  height: ${({ theme }) => theme.spacing[9]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.gray900};
  border: 1px solid ${({ theme }) => theme.colors.gray800};
  color: ${({ theme }) => theme.colors.gray400};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.DEFAULT};
  outline: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray800};
    color: ${({ theme }) => theme.colors.gray300};
  }

  & svg {
    flex-shrink: 0;
    pointer-events: none;
  }
`;
