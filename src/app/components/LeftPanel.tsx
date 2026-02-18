import { Search, ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock, Box, Image, Type, Layers, CircleDot, FileCode } from 'lucide-react';
import { Input } from './ui/input';
import { useState, useMemo } from 'react';
import { LottieLayer, LottieAnimation, LottieShape } from '../../types/lottie';
import { useUIStore } from '../../stores/uiStore';

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

const LAYER_TYPE_COLORS: Record<number, string> = {
  0: 'text-purple-400',
  1: 'text-yellow-400',
  2: 'text-green-400',
  3: 'text-gray-400',
  4: 'text-blue-400',
  5: 'text-pink-400',
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
  const cls = 'w-3 h-3 flex-shrink-0';
  switch (type) {
    case 0: return <Layers className={`${cls} text-purple-400`} />;
    case 2: return <Image className={`${cls} text-green-400`} />;
    case 4: return <Box className={`${cls} text-blue-400`} />;
    case 5: return <Type className={`${cls} text-pink-400`} />;
    default: return <CircleDot className={`${cls} text-gray-400`} />;
  }
};

/**
 * Recursively convert Lottie shape array into tree nodes for rendering.
 */
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

/**
 * Recursive shape node renderer.
 */
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
      <div
        className="flex items-center gap-1.5 py-1 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/40 transition-colors cursor-default select-none"
        style={{ paddingLeft: `${depth * 14 + 12}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => onToggle(node.id)}
            className="p-0.5 hover:bg-gray-700 rounded flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="w-2.5 h-2.5 text-gray-500" />
            ) : (
              <ChevronRight className="w-2.5 h-2.5 text-gray-500" />
            )}
          </button>
        ) : (
          <div className="w-4 flex-shrink-0" />
        )}

        <FileCode className="w-2.5 h-2.5 flex-shrink-0 text-gray-600" />

        <span className="flex-1 truncate font-mono">{node.name}</span>
        <span className="text-[9px] uppercase tracking-wide text-gray-600 mr-2 flex-shrink-0">
          {node.type}
        </span>
      </div>

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

/**
 * Single layer row + optional expanded shape tree.
 */
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
    <div>
      <div
        className={`
          group flex items-center gap-1.5 py-1.5 transition-colors
          ${isSelected
            ? 'bg-blue-600/15 border-l-2 border-blue-500'
            : 'border-l-2 border-transparent hover:bg-gray-800/60'
          }
          ${!isVisible ? 'opacity-40' : ''}
          ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{ paddingLeft: '10px' }}
        onClick={() => !isLocked && onLayerSelect(isSelected ? null : index)}
      >
        {hasShapes ? (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleLayer(index); }}
            className="p-0.5 hover:bg-gray-700 rounded flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-400" />
            )}
          </button>
        ) : (
          <div className="w-4 flex-shrink-0" />
        )}
        <LayerTypeIcon type={layer.ty} />
        <span className={`text-xs font-mono flex-1 truncate ${isSelected ? 'text-blue-300' : 'text-gray-300'}`}>
          {layer.nm || `Layer ${index}`}
        </span>
        <span className={`text-[9px] uppercase tracking-wide flex-shrink-0 ${LAYER_TYPE_COLORS[layer.ty] ?? 'text-gray-500'}`}>
          {LAYER_TYPE_LABELS[layer.ty] ?? '?'}
        </span>
        <div
          className="flex items-center gap-0.5 ml-1 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onToggleVisibility(index)}
            className={`p-0.5 rounded transition-colors hover:bg-gray-700 ${
              isVisible ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
            }`}
            title={isVisible ? 'Hide layer' : 'Show layer'}
          >
            {isVisible ? (
              <Eye className="w-3 h-3 text-gray-400 hover:text-gray-200" />
            ) : (
              <EyeOff className="w-3 h-3 text-red-400 hover:text-red-300" />
            )}
          </button>

          <button
            onClick={() => onToggleLock(index)}
            className={`p-0.5 rounded transition-colors hover:bg-gray-700 ${
              isLocked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            title={isLocked ? 'Unlock layer' : 'Lock layer'}
          >
            {isLocked ? (
              <Lock className="w-3 h-3 text-amber-400 hover:text-amber-300" />
            ) : (
              <Unlock className="w-3 h-3 text-gray-400 hover:text-gray-200" />
            )}
          </button>
        </div>
      </div>

      {hasShapes && isExpanded && (
        <div className="border-l border-gray-700/60 ml-[22px]">
          {shapeTree.map((node) => (
            <ShapeNode
              key={node.id}
              node={node}
              depth={1}
              expandedNodes={expandedShapeNodes}
              onToggle={onToggleShapeNode}
            />
          ))}
        </div>
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

  // Filtered layer list (preserves original indices for correct selection/dispatch)
  const filteredLayers = useMemo(() => {
    if (!animation?.layers) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return animation.layers.map((layer, index) => ({ layer, index }));
    return animation.layers
      .map((layer, index) => ({ layer, index }))
      .filter(({ layer }) => layer.nm?.toLowerCase().includes(q));
  }, [animation?.layers, searchQuery]);

  // Stats for the header
  const stats = useMemo(() => {
    if (!animation) return null;
    return {
      total: animation.layers.length,
      visible: animation.layers.filter((l) => !l.hd).length,
      shapes: animation.layers.filter((l) => l.ty === 4).length,
    };
  }, [animation]);

  return (
    <div className="w-[280px] bg-gray-900 border-r border-gray-800 flex flex-col h-full select-none">
      <div className="px-3 pt-3 pb-2 border-b border-gray-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
            Layers
          </span>
          {stats && (
            <span className="text-[10px] text-gray-600">
              {stats.total} layers · {stats.shapes} shapes
            </span>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-gray-800 border-gray-700 text-gray-300 placeholder:text-gray-600 h-7 text-xs rounded-md"
          />
        </div>
      </div>
      {animation && (
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-gray-800/50">
          <Layers className="w-3 h-3 text-gray-500 flex-shrink-0" />
          <span className="text-[11px] font-mono text-gray-500 truncate flex-1">
            {animation.nm || 'Composition'}
          </span>
          <span className="text-[9px] text-gray-600 uppercase tracking-wide">
            {animation.fr}fps · {animation.op - animation.ip}f
          </span>
        </div>
      )}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {!animation ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-600">
            <FileCode className="w-8 h-8 opacity-30" />
            <span className="text-xs">No animation loaded</span>
          </div>
        ) : filteredLayers.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-600 text-xs">
            No layers match "{searchQuery}"
          </div>
        ) : (
          <div className="py-1">
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
          </div>
        )}
      </div>
      {selectedLayerIndex !== null && animation && (
        <div className="border-t border-gray-800 px-3 py-2 bg-gray-900/80">
          <div className="flex items-center gap-2">
            <LayerTypeIcon type={animation.layers[selectedLayerIndex]?.ty} />
            <span className="text-[11px] text-gray-400 font-mono truncate flex-1">
              {animation.layers[selectedLayerIndex]?.nm || `Layer ${selectedLayerIndex}`}
            </span>
            <span className="text-[9px] text-gray-600 uppercase">
              #{selectedLayerIndex}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}