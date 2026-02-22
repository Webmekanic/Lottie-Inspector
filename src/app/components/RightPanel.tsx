import * as S from '../../styles/RightPanelStyles';
import { useCallback } from 'react';
import { LottieLayer, LottieAnimation } from '../../types/lottie';
import { LottieEvent } from '../../machines/lottieStateMachine';
import { LAYER_TYPE_LABELS } from '../../utils/lottieConstants';
import { buildUpdatedProp } from '../../utils/lottiePropertyUtils';
import { EmptyState } from './RightPanel/EmptyState';
import { LockedState } from './RightPanel/LockedState';
import { TransformSection } from './RightPanel/TransformSection';
import { FillSection } from './RightPanel/FillSection';
import { StrokeSection } from './RightPanel/StrokeSection';
import { BlendingSection } from './RightPanel/BlendingSection';
import { TimingSection } from './RightPanel/TimingSection';
import { LayerInfoSection } from './RightPanel/LayerInfoSection';

interface RightPanelProps {
  selectedLayer: LottieLayer | null;
  selectedLayerIndex: number | null;
  animation: LottieAnimation | null;
  /** Wire directly to XState: send(event) */
  onSend: (event: LottieEvent) => void;
}

export function RightPanel({
  selectedLayer,
  selectedLayerIndex,
  animation,
  onSend,
}: RightPanelProps) {
  const updateLayerProp = useCallback(
    (property: string, value: any) => {
      if (selectedLayerIndex === null) return;
      onSend({ type: 'UPDATE_LAYER_PROPERTY', layerIndex: selectedLayerIndex, property, value });
    },
    [selectedLayerIndex, onSend]
  );

  const updateTransform = useCallback(
    (key: 'p' | 's' | 'r' | 'o' | 'a', newValue: number, index?: number) => {
      if (!selectedLayer) return;
      const existing = selectedLayer.ks[key];
      const updated = buildUpdatedProp(existing, newValue, index);
      updateLayerProp(`ks.${key}`, updated);
    },
    [selectedLayer, updateLayerProp]
  );

  // Handle empty/no selection state
  if (!selectedLayer || selectedLayerIndex === null) {
    return <EmptyState />;
  }

  // Handle locked layer state
  if (selectedLayer.locked === true) {
    return <LockedState selectedLayer={selectedLayer} selectedLayerIndex={selectedLayerIndex} />;
  }

  // Main panel rendering
  const layerTypeLabel = LAYER_TYPE_LABELS[selectedLayer.ty] ?? 'Unknown';
  const isShapeLayer = selectedLayer.ty === 4;
  const transform = selectedLayer.ks;
  const isAnimated = (prop: any) => prop?.a === 1;

  return (
    <S.PanelContainer data-tour="right-panel">
      <S.Header>
        <S.HeaderContent>
          <S.HeaderInfo>
            <S.LayerName>
              {`Layer ${selectedLayer.nm || selectedLayerIndex}`}
            </S.LayerName>
            <S.LayerMeta>
              <S.LayerType>{layerTypeLabel} Layer</S.LayerType>
              <S.LayerIndex>#{selectedLayer.ind}</S.LayerIndex>
              {selectedLayer.parent !== undefined && (
                <S.LayerParent>↳ {selectedLayer.parent}</S.LayerParent>
              )}
            </S.LayerMeta>
          </S.HeaderInfo>
          {(isAnimated(transform?.p) || isAnimated(transform?.r) || isAnimated(transform?.s)) && (
            <S.AnimatedBadge>
              <S.AnimatedDot />
              <S.AnimatedText>Animated</S.AnimatedText>
            </S.AnimatedBadge>
          )}
        </S.HeaderContent>
      </S.Header>

      <TransformSection selectedLayer={selectedLayer} onUpdateTransform={updateTransform} />

      {isShapeLayer && (
        <>
          <FillSection selectedLayer={selectedLayer} onUpdateLayerProp={updateLayerProp} />
          <StrokeSection selectedLayer={selectedLayer} onUpdateLayerProp={updateLayerProp} />
        </>
      )}

      <BlendingSection selectedLayer={selectedLayer} onUpdateLayerProp={updateLayerProp} />
      <TimingSection selectedLayer={selectedLayer} animation={animation} />
      <LayerInfoSection selectedLayer={selectedLayer} />

      <S.Spacer />
    </S.PanelContainer>
  );
}