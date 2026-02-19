import { useEffect, useState, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTour } from '../../hooks/useTour';
import * as S from './TourStyles';

export function Tour() {
  const {
    isActive,
    currentStep,
    totalSteps,
    currentStepData,
    nextStep,
    previousStep,
    skipTour,
  } = useTour();

  const [targetPosition, setTargetPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const [tooltipPosition, setTooltipPosition] = useState({
    top: 0,
    left: 0,
  });

  const updatePositions = useCallback(() => {
    if (!currentStepData || !isActive) return;

    // For center placement, we don't need the target element
    if (currentStepData.placement === 'center') {
      const tooltipWidth = Math.min(400, window.innerWidth * 0.9);
      const tooltipHeight = Math.min(300, window.innerHeight * 0.5);
      setTooltipPosition({
        top: window.innerHeight / 2 - tooltipHeight / 2,
        left: window.innerWidth / 2 - tooltipWidth / 2,
      });
      return;
    }

    const element = document.querySelector(currentStepData.target);
    if (!element) {
      console.warn(`Tour target not found: ${currentStepData.target}, will auto-skip if not found shortly`);
      // Auto-advance to next step after a brief delay if element still isn't found
      const capturedStep = currentStep;
      setTimeout(() => {
        const retryElement = document.querySelector(currentStepData.target);
        if (!retryElement && isActive && currentStep === capturedStep) {
          console.warn(`Tour target still not found: ${currentStepData.target}, skipping to next step`);
          nextStep();
        }
      }, 1000);
      return;
    }

    const rect = element.getBoundingClientRect();
    const padding = currentStepData.highlightPadding || 8;

    // Update highlight position
    setTargetPosition({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    });

    // Calculate tooltip position based on placement
    const tooltipWidth = Math.min(400, window.innerWidth * 0.9);
    const tooltipHeight = Math.min(300, window.innerHeight * 0.5); // Responsive approximation
    const spacing = 20;

    let top = 0;
    let left = 0;

    switch (currentStepData.placement) {
      case 'top':
        top = rect.top - tooltipHeight - spacing;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + spacing;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - spacing;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + spacing;
        break;
      default:
        top = rect.bottom + spacing;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
    }

    // Keep tooltip within viewport bounds
    const maxTop = window.innerHeight - tooltipHeight - 20;
    const maxLeft = window.innerWidth - tooltipWidth - 20;
    
    top = Math.max(20, Math.min(top, maxTop));
    left = Math.max(20, Math.min(left, maxLeft));

    setTooltipPosition({ top, left });
  }, [currentStepData, isActive, nextStep]);

  useEffect(() => {
    if (isActive) {
      let frameId: number | null = null;
      const handleScrollOrResize = () => {
        if (frameId !== null) {
          return;
        }
        frameId = window.requestAnimationFrame(() => {
          frameId = null;
          updatePositions();
        });
      };

      // Initial position
      updatePositions();

      // Update on window resize or scroll (throttled per animation frame)
      window.addEventListener('resize', handleScrollOrResize);
      window.addEventListener('scroll', handleScrollOrResize, true);

      // Delay to ensure DOM is ready
      const timer = setTimeout(updatePositions, 100);

      return () => {
        if (frameId !== null) {
          cancelAnimationFrame(frameId);
          frameId = null;
        }
        window.removeEventListener('resize', handleScrollOrResize);
        window.removeEventListener('scroll', handleScrollOrResize, true);
        clearTimeout(timer);
      };
    }
  }, [isActive, currentStep, updatePositions]);

  if (!isActive || !currentStepData) {
    return null;
  }

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const isCenterPlacement = currentStepData.placement === 'center';

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only skip tour if clicked directly on overlay, not on tooltip
    if (e.target === e.currentTarget) {
      skipTour();
    }
  };

  const handleTooltipClick = (e: React.MouseEvent) => {
    // Prevent clicks inside tooltip from closing the tour
    e.stopPropagation();
  };

  return (
    <>
      <S.TourOverlay onClick={handleOverlayClick} $isCenterPlacement={isCenterPlacement} />
      
      <S.TourHighlight
        $top={targetPosition.top}
        $left={targetPosition.left}
        $width={targetPosition.width}
        $height={targetPosition.height}
        $isVisible={!isCenterPlacement}
      />

      <S.TourTooltip
        $top={tooltipPosition.top}
        $left={tooltipPosition.left}
        $placement={currentStepData.placement || 'bottom'}
        onClick={handleTooltipClick}
      >
        <S.TooltipHeader>
          <S.TooltipTitle>{currentStepData.title}</S.TooltipTitle>
          <S.CloseButton onClick={skipTour} title="Skip tour">
            <X size={16} />
          </S.CloseButton>
        </S.TooltipHeader>

        <S.TooltipContent>{currentStepData.content}</S.TooltipContent>

        <S.TooltipFooter>
          <S.ProgressIndicator>
            <span>{currentStep + 1} / {totalSteps}</span>
            <S.ProgressDots>
              {Array.from({ length: Math.min(totalSteps, 8) }).map((_, i) => (
                <S.ProgressDot key={i} $active={i === currentStep} />
              ))}
            </S.ProgressDots>
          </S.ProgressIndicator>

          <S.ButtonGroup>
            {!isFirstStep && (
              <S.TourButton onClick={previousStep} $variant="secondary">
                <ChevronLeft size={16} />
                Back
              </S.TourButton>
            )}
            
            {isFirstStep && (
              <S.TourButton onClick={skipTour} $variant="ghost">
                Skip Tour
              </S.TourButton>
            )}

            <S.TourButton onClick={nextStep} $variant="primary">
              {isLastStep ? 'Finish' : 'Next'}
              {!isLastStep && <ChevronRight size={16} />}
            </S.TourButton>
          </S.ButtonGroup>
        </S.TooltipFooter>
      </S.TourTooltip>
    </>
  );
}
