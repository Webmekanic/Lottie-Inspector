import { Search, ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { Input } from './ui/input';
import { useState, useMemo } from 'react';
import { LottieLayer, LottieAnimation } from '../../types/lottie';
import { useUIStore } from '../../stores/uiStore';

interface LeftPanelProps {
  animation: LottieAnimation | null;
  selectedLayerIndex: number | null;
  onLayerSelect: (index: number | null) => void;
  onToggleVisibility: (index: number) => void;
  onToggleLock: (index: number) => void;
}

const getLayerTypeLabel = (type: number): string => {
  switch (type) {
    case 0: return 'Precomp';
    case 1: return 'Solid';
    case 2: return 'Image';
    case 3: return 'Null';
    case 4: return 'Shape';
    case 5: return 'Text';
    default: return 'Unknown';
  }
};

export function LeftPanel({ 
  animation, 
  selectedLayerIndex, 
  onLayerSelect,
  onToggleVisibility,
  onToggleLock
}: LeftPanelProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const { searchQuery, setSearchQuery } = useUIStore();

  const toggleNode = (index: number) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const filteredLayers = useMemo(() => {
    if (!animation?.layers) return [];
    if (!searchQuery) return animation.layers;
    
    return animation.layers.filter(layer => 
      layer.nm.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [animation?.layers, searchQuery]);

  const renderLayer = (layer: LottieLayer, index: number, depth: number = 0) => {
    const isExpanded = expandedNodes.has(index);
    const hasShapes = layer.shapes && layer.shapes.length > 0;
    const isSelected = selectedLayerIndex === index;
    const isVisible = layer.visible !== false;
    const isLocked = layer.locked === true;

    return (
      <div key={index}>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-gray-800 transition-colors ${
            isSelected ? 'bg-blue-600/20 border-l-2 border-blue-500' : ''
          } ${!isVisible ? 'opacity-50' : ''}`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => !isLocked && onLayerSelect(index)}
        >
          {hasShapes ? (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                toggleNode(index); 
              }} 
              className="p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-400" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}
          
          <span className="text-xs font-mono flex-1 text-gray-300 truncate">
            {layer.nm || `Layer ${index}`}
          </span>
          
          <span className="text-[10px] text-gray-500 uppercase">
            {getLayerTypeLabel(layer.ty)}
          </span>
          
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleVisibility(index)}
              className="p-0.5 hover:bg-gray-700 rounded"
            >
              {isVisible ? (
                <Eye className="w-3 h-3 text-gray-500 hover:text-gray-300" />
              ) : (
                <EyeOff className="w-3 h-3 text-gray-500 hover:text-gray-300" />
              )}
            </button>
            <button
              onClick={() => onToggleLock(index)}
              className="p-0.5 hover:bg-gray-700 rounded"
            >
              {isLocked ? (
                <Lock className="w-3 h-3 text-gray-500 hover:text-gray-300" />
              ) : (
                <Unlock className="w-3 h-3 text-gray-400 hover:text-gray-300" />
              )}
            </button>
          </div>
        </div>
        
        {hasShapes && isExpanded && (
          <div className="border-l border-gray-700 ml-6">
            {layer.shapes!.map((shape, shapeIdx) => (
              <div
                key={shapeIdx}
                className="flex items-center gap-2 px-3 py-1 text-xs text-gray-400 hover:bg-gray-800/50"
                style={{ paddingLeft: `${(depth + 1) * 16 + 12}px` }}
              >
                <div className="w-4" />
                <span className="flex-1 truncate">{shape.nm || `Shape ${shapeIdx}`}</span>
                <span className="text-[10px] text-gray-600 uppercase">{shape.ty}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-[280px] bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      {/* Search Section */}
      <div className="p-3 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-800 border-gray-700 text-gray-300 placeholder:text-gray-500 h-8 text-sm"
          />
        </div>
      </div>
      
      {/* Layer Tree */}
      <div className="flex-1 overflow-auto">
        {!animation ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            No animation loaded
          </div>
        ) : filteredLayers.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            No layers found
          </div>
        ) : (
          <div className="py-2">
            {filteredLayers.map((layer) => {
              const actualIndex = animation.layers.indexOf(layer);
              return renderLayer(layer, actualIndex, 0);
            })}
          </div>
        )}
      </div>
    </div>
  );
}
