import styled from 'styled-components';
import { Search } from 'lucide-react';

export const PanelContainer = styled.div`
  width: 280px;
  background-color: ${({ theme }) => theme.colors.gray900};
  border-right: 1px solid ${({ theme }) => theme.colors.gray800};
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
`;

export const Header = styled.div`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[2]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray800};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SectionTitle = styled.span`
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.gray500};
`;

export const Stats = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray600};
`;

export const SearchContainer = styled.div`
  position: relative;
`;

export const SearchIcon = styled(Search)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: ${({ theme }) => theme.colors.gray500};
  pointer-events: none;
`;

export const SearchInput = styled.input`
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

export const CompositionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[1.5]} ${theme.spacing[3]}`};
  border-bottom: 1px solid rgba(39, 39, 42, 0.5);
`;

export const CompositionName = styled.span`
  font-size: 11px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray500};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CompositionMeta = styled.span`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.gray600};
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.gray600};
`;

export const EmptyText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

export const LayerList = styled.div`
  padding: ${({ theme }) => theme.spacing[1]} 0;
`;

export const LayerRowContainer = styled.div<{ $isSelected: boolean; $isVisible: boolean; $isLocked: boolean }>`
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

export const ExpandButton = styled.button`
  padding: 2px;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  flex-shrink: 0;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray700};
  }
`;

export const ExpandSpacer = styled.div`
  width: 16px;
  flex-shrink: 0;
`;

export const LayerName = styled.span<{ $isSelected: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ $isSelected, theme }) => $isSelected ? theme.colors.blue400 : theme.colors.gray300};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LayerTypeLabel = styled.span<{ $color: string }>`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  color: ${({ $color }) => $color};
`;

export const IconButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: ${({ theme }) => theme.spacing[1]};
  flex-shrink: 0;
`;

export const IconButton = styled.button<{ $visible?: boolean }>`
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

export const ShapeTreeBorder = styled.div`
  border-left: 1px solid rgba(63, 63, 70, 0.6);
  margin-left: 22px;
`;

export const ShapeNodeContainer = styled.div<{ $depth: number }>`
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

export const ShapeNodeSpacer = styled.div`
  width: 16px;
  flex-shrink: 0;
`;

export const ShapeNodeName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
`;

export const ShapeNodeType = styled.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.gray600};
  margin-right: ${({ theme }) => theme.spacing[2]};
  flex-shrink: 0;
`;

export const SelectedLayerFooter = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray800};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background-color: rgba(24, 24, 27, 0.8);
`;

export const FooterContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const FooterLayerName = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray400};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FooterIndex = styled.span`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.gray600};
  text-transform: uppercase;
`;

export const StyledIconWrapper = styled.div`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
