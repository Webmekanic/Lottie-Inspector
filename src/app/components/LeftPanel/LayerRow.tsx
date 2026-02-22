import { useMemo } from 'react';
import { ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import * as S from '../../../styles/LeftPanelStyles';
import { LottieLayer } from '../../../types/lottie';
import { LAYER_TYPE_LABELS, LAYER_TYPE_COLOR_MAP } from '../../../utils/lottieConstants';
import { buildShapeTree } from '../../../utils/shapeTreeUtils';
import { LayerTypeIcon } from './LayerTypeIcon';
import { ShapeNode } from './ShapeNode';

interface LayerRowProps {
  layer: LottieLayer;
  index: number;
  isSelected: boolean;
  expandedLayers: Set<number>;
  expandedShapeNodes: Set<string>;
  onLayerSelect: (index: number | null) => void;
  onToggleVisibility: (index: number) => void;
  onToggleLock: (index: number) => void;
  onToggleLayer: (index: number) => void;
  onToggleShapeNode: (id: string) => void;
}

export function LayerRow({
  layer,
  index,
  isSelected,
  expandedLayers,
  expandedShapeNodes,
  onLayerSelect,
  onToggleVisibility,
  onToggleLock,
  onToggleLayer,
  onToggleShapeNode,
}: LayerRowProps) {
  const isExpanded = expandedLayers.has(index);
  const hasShapes = !!(layer.shapes?.length);
  const isVisible = !layer.hd;
  const isLocked = layer.locked === true;

  const shapeTree = useMemo(
    () => (hasShapes ? buildShapeTree(layer.shapes!, `layer-${index}`) : []),
    [layer.shapes, index, hasShapes]
  );

  return (
    <div className="group" data-tour="layer-item">
      <S.LayerRowContainer
        $isSelected={isSelected}
        $isVisible={isVisible}
        $isLocked={isLocked}
        onClick={() => !isLocked && onLayerSelect(isSelected ? null : index)}
      >
        {hasShapes ? (
          <S.ExpandButton
            onClick={(e) => { e.stopPropagation(); onToggleLayer(index); }}
          >
            {isExpanded ? (
              <ChevronDown size={12} color="#a1a1aa" />
            ) : (
              <ChevronRight size={12} color="#a1a1aa" />
            )}
          </S.ExpandButton>
        ) : (
          <S.ExpandSpacer />
        )}
        <LayerTypeIcon type={layer.ty} />
        <S.LayerName $isSelected={isSelected}>
          {`Layer ${layer.nm || `Layer ${index}`}`}
        </S.LayerName>
        <S.LayerTypeLabel $color={LAYER_TYPE_COLOR_MAP[layer.ty] || '#71717a'}>
          {LAYER_TYPE_LABELS[layer.ty] ?? '?'}
        </S.LayerTypeLabel>
        <S.IconButtonGroup onClick={(e) => e.stopPropagation()}>
          <S.IconButton
            onClick={() => onToggleVisibility(index)}
            $visible={!isVisible}
            title={isVisible ? 'Hide layer' : 'Show layer'}
          >
            {isVisible ? (
              <Eye size={12} color="#a1a1aa" />
            ) : (
              <EyeOff size={12} color="#f87171" />
            )}
          </S.IconButton>

          <S.IconButton
            onClick={() => onToggleLock(index)}
            $visible={isLocked}
            title={isLocked ? 'Unlock layer' : 'Lock layer'}
          >
            {isLocked ? (
              <Lock size={12} color="#fbbf24" />
            ) : (
              <Unlock size={12} color="#a1a1aa" />
            )}
          </S.IconButton>
        </S.IconButtonGroup>
      </S.LayerRowContainer>

      {hasShapes && isExpanded && (
        <S.ShapeTreeBorder>
          {shapeTree.map((node) => (
            <ShapeNode
              key={node.id}
              node={node}
              depth={1}
              expandedNodes={expandedShapeNodes}
              onToggle={onToggleShapeNode}
            />
          ))}
        </S.ShapeTreeBorder>
      )}
    </div>
  );
}
