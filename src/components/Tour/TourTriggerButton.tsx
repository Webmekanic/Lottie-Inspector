import { HelpCircle } from 'lucide-react';
import { useTour } from '../../hooks/useTour';
import * as S from './TourStyles';

export function TourTriggerButton() {
  const { startTour } = useTour();

  return (
    <S.TourStartButton onClick={startTour} title="Start guided tour">
      <HelpCircle size={16} />
      Take Tour
    </S.TourStartButton>
  );
}
