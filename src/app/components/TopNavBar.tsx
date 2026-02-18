import { useRef } from 'react';
import styled from 'styled-components';
import { Upload, Download, RotateCcw, Sun, Moon } from 'lucide-react';
import { Switch } from './ui/switch';
import { useUIStore } from '../../stores/uiStore';

const NavContainer = styled.div`
  height: 3.5rem;
  background-color: ${({ theme }) => theme.colors.gray950};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray800};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing[6]};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Logo = styled.div`
  width: 2rem;
  height: 2rem;
  background: linear-gradient(to bottom right, ${({ theme }) => theme.colors.blue500}, ${({ theme }) => theme.colors.purple500});
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoText = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Title = styled.h1`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.white};
`;

const FileName = styled.span`
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const MiddleSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const HiddenInput = styled.input`
  display: none;
`;

const StyledButton = styled.button<{ $variant?: 'primary' | 'outline' | 'ghost'; $disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.DEFAULT};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  ${({ $variant, theme }) => {
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
      return `
        background-color: ${theme.colors.gray800};
        border: 1px solid ${theme.colors.gray700};
        color: ${theme.colors.gray300};
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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const RenderModeToggle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[1.5]} ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.gray800};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ModeLabel = styled.span<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ $active, theme }) => ($active ? theme.colors.white : theme.colors.gray500)};
  transition: color ${({ theme }) => theme.transitions.DEFAULT};
`;

const FpsBadge = styled.div`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background-color: ${({ theme }) => theme.colors.gray800};
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  color: ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ThemeToggleButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray400};
  transition: all ${({ theme }) => theme.transitions.DEFAULT};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray800};
    color: ${({ theme }) => theme.colors.white};
  }
`;

interface TopNavBarProps {
  fileName: string;
  renderMode: 'svg' | 'canvas';
  onRenderModeChange: (mode: 'svg' | 'canvas') => void;
  fps: number;
  onUpload: (file: File) => void;
  onExport: () => void;
  onReset: () => void;
  hasAnimation: boolean;
}

export function TopNavBar({
  fileName,
  renderMode,
  onRenderModeChange,
  fps,
  onUpload,
  onExport,
  onReset,
  hasAnimation,
}: TopNavBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useUIStore();
  const isDarkMode = theme === 'dark';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <NavContainer>
      <LeftSection>
        <LogoSection>
          <Logo>
            <LogoText>L</LogoText>
          </Logo>
          <Title>Lottie Inspector</Title>
        </LogoSection>
        <FileName>{fileName || 'No file loaded'}</FileName>
      </LeftSection>

      <MiddleSection>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
        />
        <StyledButton
          $variant="primary"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={16} />
          Upload JSON
        </StyledButton>
        <StyledButton
          $variant="outline"
          onClick={onExport}
          disabled={!hasAnimation}
          $disabled={!hasAnimation}
        >
          <Download size={16} />
          Export
        </StyledButton>
        <StyledButton
          $variant="ghost"
          onClick={onReset}
          disabled={!hasAnimation}
          $disabled={!hasAnimation}
        >
          <RotateCcw size={16} />
          Reset
        </StyledButton>
      </MiddleSection>

      <RightSection>
        <RenderModeToggle>
          <ModeLabel $active={renderMode === 'svg'}>SVG</ModeLabel>
          <Switch
            checked={renderMode === 'canvas'}
            onCheckedChange={(checked) => onRenderModeChange(checked ? 'canvas' : 'svg')}
            disabled={!hasAnimation}
          />
          <ModeLabel $active={renderMode === 'canvas'}>Canvas</ModeLabel>
        </RenderModeToggle>
        <FpsBadge>{fps.toFixed(1)} FPS</FpsBadge>
        <ThemeToggleButton onClick={toggleTheme}>
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </ThemeToggleButton>
      </RightSection>
    </NavContainer>
  );
}
