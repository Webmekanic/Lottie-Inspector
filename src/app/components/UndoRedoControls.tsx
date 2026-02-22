import { Undo2, Redo2 } from 'lucide-react';
import * as S from '../../styles/UndoRedoStyles';
import { getModifierKey, getShiftKey } from '../../utils/platform';

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
  const modKey = getModifierKey();
  const shiftKey = getShiftKey();

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
          Redo <S.TooltipShortcut>{modKey}+{shiftKey}+Z</S.TooltipShortcut>
        </S.Tooltip>
      </S.UndoRedoButton>
    </S.UndoRedoContainer>
  );
}
