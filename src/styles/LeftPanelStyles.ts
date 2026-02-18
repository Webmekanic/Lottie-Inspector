import styled from 'styled-components';
import { Search } from 'lucide-react';

export const PanelContainer = styled.div`
  width: 300px;
  background-color: ${({ theme }) => theme.colors.gray900};
  border-right: 1px solid ${({ theme }) => theme.colors.gray800};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const Header = styled.div`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray800};
  flex-shrink: 0;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray100};
`;

export const Stats = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray500};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
`;

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchIcon = styled(Search)`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  width: 14px;
  height: 14px;
  color: ${({ theme }) => theme.colors.gray500};
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: ${({ theme }) => theme.spacing[8]};
  padding: 0 ${({ theme }) => theme.spacing[3]} 0 ${({ theme }) => theme.spacing[9]};
  background-color: ${({ theme }) => theme.colors.gray800};
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray100};
  outline: none;
  transition: all ${({ theme }) => theme.transitions.DEFAULT};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray500};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.blue500};
    background-color: ${({ theme }) => theme.colors.gray900};
  }
`;

export const CompositionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.gray800}40;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray800};
`;

export const CompositionName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray300};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CompositionMeta = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray500};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
`;

export const LayersContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
`;

export const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

export const LayerList = styled.div`
  display: flex;
  flex-direction: column;
`;

interface LayerRowContainerProps {
  $isSelected: boolean;
  $isVisible: boolean;
  $isLocked: boolean;
}

export const LayerRowContainer = styled.div<LayerRowContainerProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[1.5]} ${({ theme }) => theme.spacing[3]};
  cursor: ${({ $isLocked }) => $isLocked ? 'not-allowed' : 'pointer'};
  background-color: ${({ $isSelected, theme }) => 
    $isSelected ? `${theme.colors.blue500}14` : 'transparent'};
  border-left: 2px solid ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors.blue500 : 'transparent'};
  opacity: ${({ $isVisible }) => $isVisible ? 1 : 0.5};
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};

  &:hover {
    background-color: ${({ $isSelected, $isLocked, theme }) =>
      $isLocked ? 'transparent' : $isSelected ? `${theme.colors.blue500}1A` : theme.colors.gray800};
  }
`;

export const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.gray400};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.gray300};
  }
`;

export const ExpandSpacer = styled.div`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

export const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface LayerNameProps {
  $isSelected: boolean;
}

export const LayerName = styled.span<LayerNameProps>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ $isSelected, theme }) => $isSelected ? theme.colors.blue400 : theme.colors.gray300};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

interface LayerTypeLabelProps {
  $color: string;
}

export const LayerTypeLabel = styled.span<LayerTypeLabelProps>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ $color }) => $color};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  padding: 2px ${({ theme }) => theme.spacing[1.5]};
  background-color: ${({ $color }) => `${$color}14`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  flex-shrink: 0;
`;

export const IconButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  ${LayerRowContainer}:hover & {
    opacity: 1;
  }
`;

interface IconButtonProps {
  $visible?: boolean;
}

export const IconButton = styled.button<IconButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  flex-shrink: 0;
  transition: all ${({ theme }) => theme.transitions.fast};
  opacity: ${({ $visible }) => $visible ? 1 : 0.6};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray700};
  }
`;

export const ShapeTreeBorder = styled.div`
  border-left: 1px solid ${({ theme }) => theme.colors.gray800};
  margin-left: ${({ theme }) => theme.spacing[6]};
`;

interface ShapeNodeContainerProps {
  $depth: number;
}

export const ShapeNodeContainer = styled.div<ShapeNodeContainerProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1.5]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  padding-left: ${({ $depth, theme }) => `calc(${$depth} * ${theme.spacing[4]})`};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray400};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray800}40;
  }
`;

export const ShapeNodeSpacer = styled.div`
  width: 10px;
  height: 10px;
  flex-shrink: 0;
`;

export const ShapeNodeName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.gray300};
`;

export const ShapeNodeType = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  flex-shrink: 0;
`;

export const SelectedLayerFooter = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray800};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.gray900};
  flex-shrink: 0;
`;

export const FooterContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const FooterLayerName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray400};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FooterIndex = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
`;

export const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray800};
  background-color: ${({ theme }) => theme.colors.gray900};
  flex-shrink: 0;
`;

interface TabButtonProps {
  $active: boolean;
}

export const TabButton = styled.button<TabButtonProps>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active, theme }) =>
    $active ? theme.colors.blue400 : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.blue400 : theme.colors.gray500};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.DEFAULT};

  & svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: ${({ $active, theme }) =>
      $active ? theme.colors.blue400 : theme.colors.gray400};
    background-color: ${({ theme }) => theme.colors.gray800}40;
  }
`;

export const TabBadge = styled.span`
  padding: 2px ${({ theme }) => theme.spacing[1.5]};
  background-color: ${({ theme }) => theme.colors.blue500};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 9px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.white};
  line-height: 1;
`;
