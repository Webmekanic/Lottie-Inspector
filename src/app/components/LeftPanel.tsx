import { Layers, FileCode, Sparkles } from 'lucide-react';
import { useState, useMemo } from 'react';
import { LottieLayer, LottieAnimation } from '../../types/lottie';
import { LottieEvent } from '../../machines/lottieStateMachine';
import { useUIStore } from '../../stores/uiStore';
import { AIChat } from './AIChat';
import { LayerRow } from './LeftPanel/LayerRow';
import { LayerTypeIcon } from './LeftPanel/LayerTypeIcon';
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
      .filter(({ layer, index }) => {
        const layerName = `Layer ${layer.nm || index + 1}`;
        return layerName.toLowerCase().includes(q);
      });
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
          {/* <S.TabBadge>NEW</S.TabBadge> */}
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
