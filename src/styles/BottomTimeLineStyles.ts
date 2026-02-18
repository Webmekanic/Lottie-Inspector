import styled from 'styled-components';
import { Layers } from 'lucide-react';

// Constants that styled components depend on
export const ROW_H = 24;
export const RULER_H = 28;
export const HEADER_H = 36;
export const LABEL_W = 180;
export const MIN_H = 160;
export const MAX_H = 520;

// Ruler Components
export const RulerContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

export const RulerStripe = styled.div<{ left: string; width: string }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ left }) => left};
  width: ${({ width }) => width};
  background: rgba(255, 255, 255, 0.014);
`;

export const RulerMark = styled.div<{ left: string }>`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  left: ${({ left }) => left};
`;

export const RulerTickMajor = styled.div`
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.gray600};
`;

export const RulerTickMinor = styled.div`
  width: 1px;
  height: 6px;
  background-color: rgba(63, 63, 70, 0.7);
`;

export const RulerLabel = styled.span`
  font-size: 9px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 2px;
  transform: translateX(-50%);
  white-space: nowrap;
  line-height: 1;
`;

export const RulerLabelTime = styled.span`
  color: ${({ theme }) => theme.colors.gray700};
  margin-left: 2px;
`;

// Track Row Components
export const TrackRowContainer = styled.div<{ isSelected: boolean }>`
  position: relative;
  border-bottom: 1px solid rgba(39, 39, 42, 0.4);
  height: ${ROW_H}px;
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(59, 130, 246, 0.06)' : 'transparent'};

  &:hover {
    background-color: ${({ isSelected }) =>
      isSelected ? 'rgba(59, 130, 246, 0.06)' : 'rgba(255, 255, 255, 0.018)'};
  }
`;

export const LayerDurationBar = styled.div<{ ipPct: number; widPct: number; color: string; isSelected: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${({ ipPct }) => ipPct}%;
  width: ${({ widPct }) => widPct}%;
  height: 10px;
  border-radius: 2px;
  pointer-events: none;
  background: ${({ isSelected, color }) =>
    isSelected ? `${color}18` : 'rgba(255, 255, 255, 0.04)'};
  border: 1px solid ${({ isSelected, color }) =>
    isSelected ? `${color}40` : 'rgba(255, 255, 255, 0.07)'};
`;

export const KeyframeContainer = styled.div<{ left: string }>`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: ${({ left }) => left};
  display: flex;
  gap: 1px;
  z-index: 10;
  pointer-events: none;
`;

export const KeyframeDot = styled.div<{ color: string }>`
  width: 7px;
  height: 7px;
  transform: rotate(45deg);
  flex-shrink: 0;
  background-color: ${({ color }) => color};
  border-radius: 1px;
`;

// Container & Resize
export const Container = styled.div<{ height: number }>`
  background-color: ${({ theme }) => theme.colors.gray950};
  border-top: 1px solid rgba(39, 39, 42, 0.6);
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: hidden;
  height: ${({ height }) => height}px;
`;

export const ResizeHandle = styled.div`
  height: 3px;
  flex-shrink: 0;
  cursor: row-resize;
  background: transparent;

  &:hover > div {
    background-color: rgba(59, 130, 246, 0.5);
  }
`;

export const ResizeBar = styled.div`
  height: 1px;
  background-color: rgba(39, 39, 42, 0.6);
  margin-top: 4px;
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};
`;

// Header Components
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid rgba(39, 39, 42, 0.6);
  flex-shrink: 0;
  height: ${HEADER_H}px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const TimelineLabel = styled.span`
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.gray500};
`;

export const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  padding: 2px 6px;
`;

export const LiveDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.red500};
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

export const LiveText = styled.span`
  font-size: 9px;
  color: #f87171;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// Frame Counter
export const FrameCounter = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${({ theme }) => theme.colors.gray900};
  border: 1px solid ${({ theme }) => theme.colors.gray800};
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  padding: 2px ${({ theme }) => theme.spacing[2]};
`;

export const CurrentFrame = styled.span`
  font-size: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.blue400};
  font-variant-numeric: tabular-nums;
  width: 40px;
  text-align: right;
`;

export const FrameSeparator = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray700};
`;

export const TotalFrame = styled.span`
  font-size: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray500};
  font-variant-numeric: tabular-nums;
`;

export const FrameDivider = styled.div`
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.gray800};
  margin: 0 2px;
`;

export const TimeDisplay = styled.span`
  font-size: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray500};
`;

export const FpsDisplay = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray700};
  margin-left: 2px;
`;

// Zoom Controls
export const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const ZoomButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.DEFAULT};
  color: ${({ theme }) => theme.colors.gray500};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.DEFAULT};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray800};
    color: ${({ theme }) => theme.colors.gray300};
  }
`;

export const ZoomDisplay = styled.button`
  font-size: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray500};
  width: 40px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color ${({ theme }) => theme.transitions.DEFAULT};

  &:hover {
    color: ${({ theme }) => theme.colors.gray300};
  }
`;

// Content Layout
export const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const LabelColumn = styled.div`
  flex-shrink: 0;
  border-right: 1px solid rgba(39, 39, 42, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: ${LABEL_W}px;
`;

export const LabelHeader = styled.div`
  flex-shrink: 0;
  border-bottom: 1px solid rgba(39, 39, 42, 0.6);
  background-color: ${({ theme }) => theme.colors.gray950};
  display: flex;
  align-items: flex-end;
  padding: 0 ${({ theme }) => theme.spacing[2]} 4px;
  height: ${RULER_H}px;
`;

export const LayerCount = styled.span`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.gray600};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

export const LabelScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

// Layer Labels
export const LayerLabelRow = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 ${({ theme }) => theme.spacing[2]};
  border-bottom: 1px solid rgba(39, 39, 42, 0.4);
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};
  flex-shrink: 0;
  height: ${ROW_H}px;
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(59, 130, 246, 0.07)' : 'transparent'};
  border-left: 2px solid ${({ isSelected, theme }) =>
    isSelected ? theme.colors.blue500 : 'transparent'};

  &:hover {
    background-color: ${({ isSelected }) =>
      isSelected ? 'rgba(59, 130, 246, 0.07)' : 'rgba(255, 255, 255, 0.02)'};
  }
`;

export const LayerDot = styled.div<{ color: string }>`
  width: 6px;
  height: 6px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  flex-shrink: 0;
  background-color: ${({ color }) => color};
`;

export const LayerName = styled.span<{ isSelected: boolean }>`
  font-size: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ isSelected, theme }) =>
    isSelected ? '#93c5fd' : theme.colors.gray400};
`;

export const AnimatedIndicator = styled.div`
  width: 4px;
  height: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: rgba(251, 191, 36, 0.7);
  flex-shrink: 0;
`;

// Track Scroll
export const TrackScrollContainer = styled.div`
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TrackContainer = styled.div<{ zoom: number; isDragging: boolean }>`
  position: relative;
  min-width: ${({ zoom }) => zoom * 100}%;
  width: ${({ zoom }) => zoom * 100}%;
  min-height: 100%;
  cursor: ${({ isDragging }) => isDragging ? 'grabbing' : 'crosshair'};
`;

export const RulerHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid rgba(39, 39, 42, 0.6);
  background-color: ${({ theme }) => theme.colors.gray950};
  height: ${RULER_H}px;
`;

// Playhead
export const PlayheadOverlay = styled.div<{ playPct: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
  width: ${({ playPct }) => playPct}%;
  background: rgba(96, 165, 250, 0.025);
`;

export const PlayheadLine = styled.div<{ playPct: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 30;
  left: ${({ playPct }) => playPct}%;
  width: 1px;
  background: rgba(239, 68, 68, 0.85);
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.3);
`;

export const PlayheadTriangle = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid rgb(239, 68, 68);
`;

export const PlayheadLabel = styled.div`
  position: absolute;
  top: 4px;
  left: 28px;
  background-color: ${({ theme }) => theme.colors.red500};
  color: ${({ theme }) => theme.colors.white};
  font-size: 9px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  padding: 1px 4px;
  border-radius: 2px;
  white-space: nowrap;
`;

// Empty State
export const EmptyState = styled.div`
  background-color: ${({ theme }) => theme.colors.gray950};
  border-top: 1px solid rgba(39, 39, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${MIN_H}px;
`;

export const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const EmptyIcon = styled(Layers)`
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.colors.gray700};
`;

export const EmptyText = styled.span`
  font-size: 11px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  color: ${({ theme }) => theme.colors.gray600};
  letter-spacing: 0.05em;
`;
