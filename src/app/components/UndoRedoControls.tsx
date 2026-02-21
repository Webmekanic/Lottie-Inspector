import { Undo2, Redo2 } from 'lucide-react';
import * as S from '../../styles/UndoRedoStyles';

interface UndoRedoControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function UndoRedoControls({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: UndoRedoControlsProps) {
  // Detect OS for keyboard shortcut display
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  return (
    <S.UndoRedoContainer>
      <S.UndoRedoButton
        onClick={onUndo}
        disabled={!canUndo}
        $disabled={!canUndo}
        aria-label="Undo"
        title={`Undo (${modKey}+Z)`}
      >
        <Undo2 />
        <S.Tooltip>
          Undo <S.TooltipShortcut>{modKey}+Z</S.TooltipShortcut>
        </S.Tooltip>
      </S.UndoRedoButton>

      <S.Divider />

      <S.UndoRedoButton
        onClick={onRedo}
        disabled={!canRedo}
        $disabled={!canRedo}
        aria-label="Redo"
        title={`Redo (${modKey}+Shift+Z)`}
      >
        <Redo2 />
        <S.Tooltip>
          Redo <S.TooltipShortcut>{modKey}+⇧+Z</S.TooltipShortcut>
        </S.Tooltip>
      </S.UndoRedoButton>
    </S.UndoRedoContainer>
  );
}
