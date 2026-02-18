import { ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock, Box, Image, Type, Layers, CircleDot, FileCode, Sparkles } from 'lucide-react';
import { useState, useMemo } from 'react';
import { LottieLayer, LottieAnimation, LottieShape } from '../../types/lottie';
import { LottieEvent } from '../../machines/lottieStateMachine';
import { useUIStore } from '../../stores/uiStore';
import { AIChat } from './AIChat';
import * as S from '../../styles/LeftPanelStyles';

interface LeftPanelProps {
  animation: LottieAnimation | null;
  selectedLayerIndex: number | null;
  selectedLayer: LottieLayer | null;
  onLayerSelect: (index: number | null) => void;
  onToggleVisibility: (index: number) => void;
  onToggleLock: (index: number) => void;
  onSend: (event: LottieEvent) => void;
}

type Tab = 'layers' | 'ai';

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

const LayerTypeIcon = ({ type }: { type: number }) => {
  const color = LAYER_TYPE_COLOR_MAP[type] || '#a1a1aa';
  
  switch (type) {
    case 0: return <S.StyledIconWrapper><Layers size={12} color={color} /></S.StyledIconWrapper>;
    case 2: return <S.StyledIconWrapper><Image size={12} color={color} /></S.StyledIconWrapper>;
    case 4: return <S.StyledIconWrapper><Box size={12} color={color} /></S.StyledIconWrapper>;
    case 5: return <S.StyledIconWrapper><Type size={12} color={color} /></S.StyledIconWrapper>;
    default: return <S.StyledIconWrapper><CircleDot size={12} color={color} /></S.StyledIconWrapper>;
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
      <S.ShapeNodeContainer $depth={depth}>
        {hasChildren ? (
          <S.ExpandButton onClick={() => onToggle(node.id)}>
            {isExpanded ? (
              <ChevronDown size={10} color="#71717a" />
            ) : (
              <ChevronRight size={10} color="#71717a" />
            )}
          </S.ExpandButton>
        ) : (
          <S.ShapeNodeSpacer />
        )}

        <FileCode size={10} color="#52525b" style={{ flexShrink: 0 }} />

        <S.ShapeNodeName>{node.name}</S.ShapeNodeName>
        <S.ShapeNodeType>{node.type}</S.ShapeNodeType>
      </S.ShapeNodeContainer>

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
          {layer.nm || `Layer ${index}`}
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

export function LeftPanel({
  animation,
  selectedLayerIndex,
  selectedLayer,
  onLayerSelect,
  onToggleVisibility,
  onToggleLock,
  onSend,
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('layers');
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
    <S.PanelContainer data-tour="left-panel">
      {/* Tabs */}
      <S.TabsContainer>
        <S.TabButton $active={activeTab === 'layers'} onClick={() => setActiveTab('layers')}>
          <Layers />
          Layers
        </S.TabButton>
        <S.TabButton $active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} data-tour="ai-chat-tab">
          <Sparkles />
          AI Chat
          <S.TabBadge>NEW</S.TabBadge>
        </S.TabButton>
      </S.TabsContainer>

      {/* Tab Content */}
      {activeTab === 'layers' ? (
        <>
          <S.Header>
        <S.HeaderRow>
          <S.SectionTitle>Layers</S.SectionTitle>
          {stats && (
            <S.Stats>
              {stats.total} layers · {stats.shapes} shapes
            </S.Stats>
          )}
        </S.HeaderRow>
        <S.SearchContainer>
          <S.SearchIcon />
          <S.SearchInput
            type="text"
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </S.SearchContainer>
      </S.Header>
      {animation && (
        <S.CompositionInfo>
          <Layers size={12} color="#71717a" style={{ flexShrink: 0 }} />
          <S.CompositionName>
            {animation.nm || 'Composition'}
          </S.CompositionName>
          <S.CompositionMeta>
            {animation.fr}fps · {animation.op - animation.ip}f
          </S.CompositionMeta>
        </S.CompositionInfo>
      )}
      <S.LayersContainer>
        {!animation ? (
          <S.EmptyState>
            <FileCode size={32} style={{ opacity: 0.3 }} />
            <S.EmptyText>No animation loaded</S.EmptyText>
          </S.EmptyState>
        ) : filteredLayers.length === 0 ? (
          <S.EmptyState>
            <S.EmptyText>No layers match "{searchQuery}"</S.EmptyText>
          </S.EmptyState>
        ) : (
          <S.LayerList>
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
          </S.LayerList>
        )}
      </S.LayersContainer>
      {selectedLayerIndex !== null && animation && (
        <S.SelectedLayerFooter>
          <S.FooterContent>
            <LayerTypeIcon type={animation.layers[selectedLayerIndex]?.ty} />
            <S.FooterLayerName>
              {animation.layers[selectedLayerIndex]?.nm || `Layer ${selectedLayerIndex}`}
            </S.FooterLayerName>
            <S.FooterIndex>
              #{selectedLayerIndex}
            </S.FooterIndex>
          </S.FooterContent>
        </S.SelectedLayerFooter>
      )}
        </>
      ) : (
        /* AI Chat Tab */
        <AIChat
          animation={animation}
          selectedLayer={selectedLayer}
          selectedLayerIndex={selectedLayerIndex}
          onSend={onSend}
        />
      )}
    </S.PanelContainer>
  );
}
