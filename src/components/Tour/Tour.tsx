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

    const element = document.querySelector(currentStepData.target);
    if (!element) {
      console.warn(`Tour target not found: ${currentStepData.target}`);
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
    const tooltipWidth = 400;
    const tooltipHeight = 200; // Approximate
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
      case 'center':
        top = window.innerHeight / 2 - tooltipHeight / 2;
        left = window.innerWidth / 2 - tooltipWidth / 2;
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
  }, [currentStepData, isActive]);

  useEffect(() => {
    if (isActive) {
      // Initial position
      updatePositions();

      // Update on window resize or scroll
      window.addEventListener('resize', updatePositions);
      window.addEventListener('scroll', updatePositions, true);

      // Delay to ensure DOM is ready
      const timer = setTimeout(updatePositions, 100);

      return () => {
        window.removeEventListener('resize', updatePositions);
        window.removeEventListener('scroll', updatePositions, true);
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

  return (
    <>
      {isCenterPlacement ? (
        <S.TourOverlay onClick={skipTour} />
      ) : (
        <S.TourHighlight
          $top={targetPosition.top}
          $left={targetPosition.left}
          $width={targetPosition.width}
          $height={targetPosition.height}
        />
      )}

      <S.TourTooltip
        $top={tooltipPosition.top}
        $left={tooltipPosition.left}
        $placement={currentStepData.placement || 'bottom'}
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
