import styled from 'styled-components';
import { Layers } from 'lucide-react';

export const PanelContainer = styled.div`
  width: 300px;
  background-color: ${({ theme }) => theme.colors.gray900};
  border-left: 1px solid ${({ theme }) => theme.colors.gray800};
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`;

export const EmptyStateContainer = styled.div`
  width: 300px;
  background-color: ${({ theme }) => theme.colors.gray900};
  border-left: 1px solid ${({ theme }) => theme.colors.gray800};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const EmptyStateIcon = styled(Layers)`
  width: ${({ theme }) => theme.spacing[10]};
  height: ${({ theme }) => theme.spacing[10]};
  color: ${({ theme }) => theme.colors.gray700};
`;

export const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  text-align: center;
  line-height: 1.625;
  padding: 0 ${({ theme }) => theme.spacing[6]};
`;

export const LockedStateContainer = styled.div`
  width: 300px;
  background-color: ${({ theme }) => theme.colors.gray900};
  border-left: 1px solid ${({ theme }) => theme.colors.gray800};
  display: flex;
  flex-direction: column;
`;

export const LockedStateContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: 0 ${({ theme }) => theme.spacing[6]};
`;

export const LockedIconWrapper = styled.div`
  width: ${({ theme }) => theme.spacing[12]};
  height: ${({ theme }) => theme.spacing[12]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LockedIcon = styled.svg`
  width: ${({ theme }) => theme.spacing[6]};
  height: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.amber400};
`;

export const LockedTextContainer = styled.div`
  text-align: center;
`;

export const LockedTitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.amber400};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const LockedDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray500};
  line-height: 1.625;
`;

export const Header = styled.div`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray800};
  flex-shrink: 0;
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const HeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const LayerName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.white};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LayerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[0.5]};
`;

export const LayerType = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray500};
`;

export const LayerIndex = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray600};
`;

export const LayerParent = styled.span`
  font-size: 10px;
  color: rgba(59, 130, 246, 0.7);
`;

export const AnimatedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  padding: ${({ theme }) => theme.spacing[0.5]} ${({ theme }) => theme.spacing[1.5]};
  flex-shrink: 0;
`;

export const AnimatedDot = styled.div`
  width: ${({ theme }) => theme.spacing[1.5]};
  height: ${({ theme }) => theme.spacing[1.5]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.amber400};
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export const AnimatedText = styled.span`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.amber400};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const SectionContainer = styled.div``;

export const SectionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};

  &:hover {
    background-color: rgba(39, 39, 42, 0.4);
  }
`;

export const SectionIcon = styled.div`
  width: ${({ theme }) => theme.spacing[3]};
  height: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.gray500};
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const SectionTitle = styled.span`
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.gray500};
  flex: 1;
  text-align: left;
`;

export const ChevronIcon = styled.div`
  width: ${({ theme }) => theme.spacing[3]};
  height: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.gray600};

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const SectionContent = styled.div`
  padding: 0 ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const PropertyGroup = styled.div``;

export const PropertyLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray600};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[1.5]};
`;

export const AnimatedIndicator = styled.span`
  color: ${({ theme }) => theme.colors.amber400};
  margin-left: ${({ theme }) => theme.spacing[1]};
`;

export const FieldRowContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const FieldLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray500};
  width: ${({ theme }) => theme.spacing[16]};
  flex-shrink: 0;
`;

export const FieldContent = styled.div`
  flex: 1;
`;

export const NumberInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const NumberInputSuffix = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.spacing[2]};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray500};
  pointer-events: none;
`;

export const XYInputsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1.5]};
`;

export const XYInputGroup = styled.div`
  flex: 1;
`;

export const XYInputLabel = styled.span`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.gray600};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[0.5]};
  margin-left: ${({ theme }) => theme.spacing[0.5]};
`;

export const LinkButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[1]};
  background-color: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray700};
  }
`;

export const LinkIcon = styled.div<{ $linked?: boolean }>`
  width: ${({ theme }) => theme.spacing[3]};
  height: ${({ theme }) => theme.spacing[3]};
  color: ${({ $linked, theme }) => 
    $linked ? theme.colors.blue400 : theme.colors.gray600};

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const SliderContainer = styled.div``;

export const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[1.5]};
`;

export const SliderLabel = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray600};
`;

export const SliderValue = styled.span`
  font-size: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray400};
`;

export const ColorInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const ColorPicker = styled.input`
  width: ${({ theme }) => theme.spacing[8]};
  height: ${({ theme }) => theme.spacing[8]};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  cursor: pointer;
  overflow: hidden;
`;

export const EmptyMessage = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray600};
  font-style: italic;
`;

export const BlendSelect = styled.select`
  width: 100%;
  height: ${({ theme }) => theme.spacing[8]};
  background-color: ${({ theme }) => theme.colors.gray800};
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  color: ${({ theme }) => theme.colors.gray300};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  padding: 0 ${({ theme }) => theme.spacing[2]};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue500};
  }
`;

export const InfoRowsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const InfoValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray300};
`;

export const InfoValueHighlight = styled(InfoValue)`
  color: ${({ theme }) => theme.colors.blue400};
`;

export const InfoValueWarning = styled(InfoValue)`
  color: ${({ theme }) => theme.colors.amber400};
`;

export const TimingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1.5]};
`;

export const TimingValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray300};
`;

export const TimingUnit = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray600};
`;

export const Spacer = styled.div`
  flex: 1;
  min-height: ${({ theme }) => theme.spacing[4]};
`;
