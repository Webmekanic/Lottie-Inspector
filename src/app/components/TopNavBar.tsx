import { useRef } from 'react';
import { Upload, Download, RotateCcw, Sun, Moon } from 'lucide-react';
import { Switch } from './ui/switch';
import { TourTriggerButton } from '../../components/Tour/TourTriggerButton';
import { useUIStore } from '../../stores/uiStore';
import * as S from '../../styles/TopNavBarStyles';

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
    <S.NavContainer>
      <S.LeftSection>
        <S.LogoSection>
          {/* <S.Logo>
            <S.LogoText>L</S.LogoText>
          </S.Logo> */}
          <S.Title>Lottie Inspector</S.Title>
        </S.LogoSection>
        <S.FileName>{fileName || 'No file loaded'}</S.FileName>
      </S.LeftSection>

      <S.MiddleSection>
        <S.HiddenInput
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
        />
        <S.StyledButton
          $variant="primary"
          onClick={() => fileInputRef.current?.click()}
          data-tour="upload-button"
        >
          <Upload size={16} />
          Upload JSON
        </S.StyledButton>
        <S.StyledButton
          $variant="outline"
          onClick={onExport}
          disabled={!hasAnimation}
          $disabled={!hasAnimation}
          data-tour="export-button"
        >
          <Download size={16} />
          Export
        </S.StyledButton>
        <S.StyledButton
          $variant="ghost"
          onClick={onReset}
          disabled={!hasAnimation}
          $disabled={!hasAnimation}
        >
          <RotateCcw size={16} />
          Reset
        </S.StyledButton>
      </S.MiddleSection>

      <S.RightSection>
        <TourTriggerButton />
        <S.RenderModeToggle data-tour="render-mode">
          <S.ModeLabel $active={renderMode === 'svg'}>SVG</S.ModeLabel>
          <Switch
            checked={renderMode === 'canvas'}
            onCheckedChange={(checked) => onRenderModeChange(checked ? 'canvas' : 'svg')}
            disabled={!hasAnimation}
          />
          <S.ModeLabel $active={renderMode === 'canvas'}>Canvas</S.ModeLabel>
        </S.RenderModeToggle>
        <S.FpsBadge>{fps.toFixed(1)} FPS</S.FpsBadge>
        {/* <S.ThemeToggleButton onClick={toggleTheme}>
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </S.ThemeToggleButton> */}
      </S.RightSection>
    </S.NavContainer>
  );
}
