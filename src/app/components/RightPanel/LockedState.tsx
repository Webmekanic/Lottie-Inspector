import * as S from '../../../styles/RightPanelStyles';
import { LottieLayer } from '../../../types/lottie';
import { LAYER_TYPE_LABELS } from '../../../utils/lottieConstants';

interface LockedStateProps {
  selectedLayer: LottieLayer;
  selectedLayerIndex: number;
}

export function LockedState({ selectedLayer, selectedLayerIndex }: LockedStateProps) {
  const layerTypeLabel = LAYER_TYPE_LABELS[selectedLayer.ty] ?? 'Unknown';

  return (
    <S.LockedStateContainer data-tour="right-panel">
      <S.Header>
        <S.HeaderContent>
          <S.HeaderInfo>
            <S.LayerName>
              {`Layer ${selectedLayer.nm || selectedLayerIndex}`}
            </S.LayerName>
            <S.LayerMeta>
              <S.LayerType>{layerTypeLabel} Layer</S.LayerType>
              <S.LayerIndex>#{selectedLayer.ind}</S.LayerIndex>
            </S.LayerMeta>
          </S.HeaderInfo>
        </S.HeaderContent>
      </S.Header>
      
      <S.LockedStateContent>
        <S.LockedIconWrapper>
          <S.LockedIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </S.LockedIcon>
        </S.LockedIconWrapper>
        <S.LockedTextContainer>
          <S.LockedTitle>Layer is Locked</S.LockedTitle>
          <S.LockedDescription>
            This layer cannot be edited. Click the lock icon in the layer panel to unlock it.
          </S.LockedDescription>
        </S.LockedTextContainer>
      </S.LockedStateContent>
    </S.LockedStateContainer>
  );
}
