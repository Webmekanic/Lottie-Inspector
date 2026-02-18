import styled from 'styled-components';
import { Search, ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock, Box, Image, Type, Layers, CircleDot, FileCode } from 'lucide-react';
import { useState, useMemo } from 'react';
import { LottieLayer, LottieAnimation, LottieShape } from '../../types/lottie';
import { useUIStore } from '../../stores/uiStore';

const PanelContainer = styled.div`
  width: 280px;
  background-color: ${({ theme }) => theme.colors.gray900};
  border-right: 1px solid ${({ theme }) => theme.colors.gray800};
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
`;

const Header = styled.div`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[2]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray800};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.span`
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.gray500};
`;

const Stats = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray600};
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: ${({ theme }) => theme.colors.gray500};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[1.5]} ${theme.spacing[2]} ${theme.spacing[1.5]} ${theme.spacing[8]}`};
  background-color: ${({ theme }) => theme.colors.gray800};
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  color: ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  height: 28px;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray600};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.blue500};
    outline-offset: 0;
  }
`;

const CompositionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[1.5]} ${theme.spacing[3]}`};
  border-bottom: 1px solid rgba(39, 39, 42, 0.5);
`;

const CompositionName = styled.span`
  font-size: 11px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray500};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CompositionMeta = styled.span`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.gray600};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const LayersContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.gray600};
`;

const EmptyText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

const LayerList = styled.div`
  padding: ${({ theme }) => theme.spacing[1]} 0;
`;

const LayerRowContainer = styled.div<{ $isSelected: boolean; $isVisible: boolean; $isLocked: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0 6px 10px;
  border-left: 2px solid ${({ $isSelected, theme }) => 
    $isSelected ? theme.colors.blue500 : 'transparent'};
  background-color: ${({ $isSelected }) => 
    $isSelected ? 'rgba(59, 130, 246, 0.15)' : 'transparent'};
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0.4};
  cursor: ${({ $isLocked }) => $isLocked ? 'not-allowed' : 'pointer'};
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};

  &:hover {
    background-color: ${({ $isSelected }) => 
      $isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(39, 39, 42, 0.6)'};
  }
`;

const ExpandButton = styled.button`
  padding: 2px;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  flex-shrink: 0;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray700};
  }
`;

const ExpandSpacer = styled.div`
  width: 16px;
  flex-shrink: 0;
`;

const LayerName = styled.span<{ $isSelected: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ $isSelected, theme }) => $isSelected ? theme.colors.blue400 : theme.colors.gray300};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LayerTypeLabel = styled.span<{ $color: string }>`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  color: ${({ $color }) => $color};
`;

const IconButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: ${({ theme }) => theme.spacing[1]};
  flex-shrink: 0;
`;

const IconButton = styled.button<{ $visible?: boolean }>`
  padding: 2px;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  transition: all ${({ theme }) => theme.transitions.DEFAULT};
  opacity: ${({ $visible }) => $visible ? 1 : 0};

  .group:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray700};
  }
`;

const ShapeTreeBorder = styled.div`
  border-left: 1px solid rgba(63, 63, 70, 0.6);
  margin-left: 22px;
`;

const ShapeNodeContainer = styled.div<{ $depth: number }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  padding-left: ${({ $depth }) => $depth * 14 + 12}px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray500};
  cursor: default;
  user-select: none;
  transition: all ${({ theme }) => theme.transitions.DEFAULT};

  &:hover {
    color: ${({ theme }) => theme.colors.gray300};
    background-color: rgba(39, 39, 42, 0.4);
  }
`;

const ShapeNodeSpacer = styled.div`
  width: 16px;
  flex-shrink: 0;
`;

const ShapeNodeName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
`;

const ShapeNodeType = styled.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.gray600};
  margin-right: ${({ theme }) => theme.spacing[2]};
  flex-shrink: 0;
`;

const SelectedLayerFooter = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray800};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background-color: rgba(24, 24, 27, 0.8);
`;

const FooterContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FooterLayerName = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray400};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FooterIndex = styled.span`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.gray600};
  text-transform: uppercase;
`;

interface LeftPanelProps {
  animation: LottieAnimation | null;
  selectedLayerIndex: number | null;
  onLayerSelect: (index: number | null) => void;
  onToggleVisibility: (index: number) => void;
  onToggleLock: (index: number) => void;
}

interface ShapeTreeNode {
  id: string;
  name: string;
  type: string;
  children?: ShapeTreeNode[];
}

const LAYER_TYPE_LABELS: Record<number, string> = {
  0: 'Precomp',
  1: 'Solid',
  2: 'Image',
  3: 'Null',
  4: 'Shape',
  5: 'Text',
};

const LAYER_TYPE_COLOR_MAP: Record<number, string> = {
  0: '#c084fc',
  1: '#fbbf24',
  2: '#4ade80',
  3: '#a1a1aa',
  4: '#60a5fa',
  5: '#c084fc',
};

const SHAPE_TYPE_LABELS: Record<string, string> = {
  gr: 'Group',
  rc: 'Rect',
  el: 'Ellipse',
  sh: 'Path',
  fl: 'Fill',
  st: 'Stroke',
  tr: 'Transform',
  gf: 'G.Fill',
  gs: 'G.Stroke',
  tm: 'Trim',
  rp: 'Repeater',
  sr: 'Star',
  mm: 'Merge',
};

const StyledIconWrapper = styled.div`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LayerTypeIcon = ({ type }: { type: number }) => {
  const color = LAYER_TYPE_COLOR_MAP[type] || '#a1a1aa';
  
  switch (type) {
    case 0: return <StyledIconWrapper><Layers size={12} color={color} /></StyledIconWrapper>;
    case 2: return <StyledIconWrapper><Image size={12} color={color} /></StyledIconWrapper>;
    case 4: return <StyledIconWrapper><Box size={12} color={color} /></StyledIconWrapper>;
    case 5: return <StyledIconWrapper><Type size={12} color={color} /></StyledIconWrapper>;
    default: return <StyledIconWrapper><CircleDot size={12} color={color} /></StyledIconWrapper>;
  }
};

function buildShapeTree(shapes: LottieShape[], parentId: string): ShapeTreeNode[] {
  return shapes.map((shape, idx) => {
    const id = `${parentId}-s${idx}`;
    const label = shape.nm || SHAPE_TYPE_LABELS[shape.ty as string] || shape.ty || `Shape ${idx}`;
    const children =
      shape.ty === 'gr' && shape.it && shape.it.length > 0
        ? buildShapeTree(shape.it, id)
        : undefined;
    return { id, name: label, type: SHAPE_TYPE_LABELS[shape.ty as string] || shape.ty || '?', children };
  });
}

function ShapeNode({
  node,
  depth,
  expandedNodes,
  onToggle,
}: {
  node: ShapeTreeNode;
  depth: number;
  expandedNodes: Set<string>;
  onToggle: (id: string) => void;
}) {
  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = !!node.children?.length;

  return (
    <div>
      <ShapeNodeContainer $depth={depth}>
        {hasChildren ? (
          <ExpandButton onClick={() => onToggle(node.id)}>
            {isExpanded ? (
              <ChevronDown size={10} color="#71717a" />
            ) : (
              <ChevronRight size={10} color="#71717a" />
            )}
          </ExpandButton>
        ) : (
          <ShapeNodeSpacer />
        )}

        <FileCode size={10} color="#52525b" style={{ flexShrink: 0 }} />

        <ShapeNodeName>{node.name}</ShapeNodeName>
        <ShapeNodeType>{node.type}</ShapeNodeType>
      </ShapeNodeContainer>

      {hasChildren && isExpanded &&
        node.children!.map((child) => (
          <ShapeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            expandedNodes={expandedNodes}
            onToggle={onToggle}
          />
        ))}
    </div>
  );
}

function LayerRow({
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
}: {
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
}) {
  const isExpanded = expandedLayers.has(index);
  const hasShapes = !!(layer.shapes?.length);
  const isVisible = !layer.hd;
  const isLocked = layer.locked === true;

  const shapeTree = useMemo(
    () => (hasShapes ? buildShapeTree(layer.shapes!, `layer-${index}`) : []),
    [layer.shapes, index, hasShapes]
  );

  return (
    <div className="group">
      <LayerRowContainer
        $isSelected={isSelected}
        $isVisible={isVisible}
        $isLocked={isLocked}
        onClick={() => !isLocked && onLayerSelect(isSelected ? null : index)}
      >
        {hasShapes ? (
          <ExpandButton
            onClick={(e) => { e.stopPropagation(); onToggleLayer(index); }}
          >
            {isExpanded ? (
              <ChevronDown size={12} color="#a1a1aa" />
            ) : (
              <ChevronRight size={12} color="#a1a1aa" />
            )}
          </ExpandButton>
        ) : (
          <ExpandSpacer />
        )}
        <LayerTypeIcon type={layer.ty} />
        <LayerName $isSelected={isSelected}>
          {layer.nm || `Layer ${index}`}
        </LayerName>
        <LayerTypeLabel $color={LAYER_TYPE_COLOR_MAP[layer.ty] || '#71717a'}>
          {LAYER_TYPE_LABELS[layer.ty] ?? '?'}
        </LayerTypeLabel>
        <IconButtonGroup onClick={(e) => e.stopPropagation()}>
          <IconButton
            onClick={() => onToggleVisibility(index)}
            $visible={!isVisible}
            title={isVisible ? 'Hide layer' : 'Show layer'}
          >
            {isVisible ? (
              <Eye size={12} color="#a1a1aa" />
            ) : (
              <EyeOff size={12} color="#f87171" />
            )}
          </IconButton>

          <IconButton
            onClick={() => onToggleLock(index)}
            $visible={isLocked}
            title={isLocked ? 'Unlock layer' : 'Lock layer'}
          >
            {isLocked ? (
              <Lock size={12} color="#fbbf24" />
            ) : (
              <Unlock size={12} color="#a1a1aa" />
            )}
          </IconButton>
        </IconButtonGroup>
      </LayerRowContainer>

      {hasShapes && isExpanded && (
        <ShapeTreeBorder>
          {shapeTree.map((node) => (
            <ShapeNode
              key={node.id}
              node={node}
              depth={1}
              expandedNodes={expandedShapeNodes}
              onToggle={onToggleShapeNode}
            />
          ))}
        </ShapeTreeBorder>
      )}
    </div>
  );
}

export function LeftPanel({
  animation,
  selectedLayerIndex,
  onLayerSelect,
  onToggleVisibility,
  onToggleLock,
}: LeftPanelProps) {
  const [expandedLayers, setExpandedLayers] = useState<Set<number>>(new Set());
  const [expandedShapeNodes, setExpandedShapeNodes] = useState<Set<string>>(new Set());

  const { searchQuery, setSearchQuery } = useUIStore();

  const toggleLayer = (index: number) => {
    setExpandedLayers((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const toggleShapeNode = (id: string) => {
    setExpandedShapeNodes((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredLayers = useMemo(() => {
    if (!animation?.layers) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return animation.layers.map((layer, index) => ({ layer, index }));
    return animation.layers
      .map((layer, index) => ({ layer, index }))
      .filter(({ layer }) => layer.nm?.toLowerCase().includes(q));
  }, [animation?.layers, searchQuery]);

  const stats = useMemo(() => {
    if (!animation) return null;
    return {
      total: animation.layers.length,
      visible: animation.layers.filter((l) => !l.hd).length,
      shapes: animation.layers.filter((l) => l.ty === 4).length,
    };
  }, [animation]);

  return (
    <PanelContainer>
      <Header>
        <HeaderRow>
          <SectionTitle>Layers</SectionTitle>
          {stats && (
            <Stats>
              {stats.total} layers · {stats.shapes} shapes
            </Stats>
          )}
        </HeaderRow>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </Header>
      {animation && (
        <CompositionInfo>
          <Layers size={12} color="#71717a" style={{ flexShrink: 0 }} />
          <CompositionName>
            {animation.nm || 'Composition'}
          </CompositionName>
          <CompositionMeta>
            {animation.fr}fps · {animation.op - animation.ip}f
          </CompositionMeta>
        </CompositionInfo>
      )}
      <LayersContainer>
        {!animation ? (
          <EmptyState>
            <FileCode size={32} style={{ opacity: 0.3 }} />
            <EmptyText>No animation loaded</EmptyText>
          </EmptyState>
        ) : filteredLayers.length === 0 ? (
          <EmptyState>
            <EmptyText>No layers match "{searchQuery}"</EmptyText>
          </EmptyState>
        ) : (
          <LayerList>
            {filteredLayers.map(({ layer, index }) => (
              <LayerRow
                key={index}
                layer={layer}
                index={index}
                isSelected={selectedLayerIndex === index}
                expandedLayers={expandedLayers}
                expandedShapeNodes={expandedShapeNodes}
                onLayerSelect={onLayerSelect}
                onToggleVisibility={onToggleVisibility}
                onToggleLock={onToggleLock}
                onToggleLayer={toggleLayer}
                onToggleShapeNode={toggleShapeNode}
              />
            ))}
          </LayerList>
        )}
      </LayersContainer>
      {selectedLayerIndex !== null && animation && (
        <SelectedLayerFooter>
          <FooterContent>
            <LayerTypeIcon type={animation.layers[selectedLayerIndex]?.ty} />
            <FooterLayerName>
              {animation.layers[selectedLayerIndex]?.nm || `Layer ${selectedLayerIndex}`}
            </FooterLayerName>
            <FooterIndex>
              #{selectedLayerIndex}
            </FooterIndex>
          </FooterContent>
        </SelectedLayerFooter>
      )}
    </PanelContainer>
  );
}
