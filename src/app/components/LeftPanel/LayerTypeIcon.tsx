import { Box, Image, Type, Layers, CircleDot } from 'lucide-react';
import { LAYER_TYPE_COLOR_MAP } from '../../../utils/lottieConstants';
import * as S from '../../../styles/LeftPanelStyles';

interface LayerTypeIconProps {
  type: number;
}

export function LayerTypeIcon({ type }: LayerTypeIconProps) {
  const color = LAYER_TYPE_COLOR_MAP[type] || '#a1a1aa';
  
  switch (type) {
    case 0: 
      return (
        <S.StyledIconWrapper>
          <Layers size={12} color={color} />
        </S.StyledIconWrapper>
      );
    case 2: 
      return (
        <S.StyledIconWrapper>
          <Image size={12} color={color} />
        </S.StyledIconWrapper>
      );
    case 4: 
      return (
        <S.StyledIconWrapper>
          <Box size={12} color={color} />
        </S.StyledIconWrapper>
      );
    case 5: 
      return (
        <S.StyledIconWrapper>
          <Type size={12} color={color} />
        </S.StyledIconWrapper>
      );
    default: 
      return (
        <S.StyledIconWrapper>
          <CircleDot size={12} color={color} />
        </S.StyledIconWrapper>
      );
  }
}
