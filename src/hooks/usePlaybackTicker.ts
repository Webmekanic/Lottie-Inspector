import { useEffect, useRef, RefObject } from 'react';
import { AnimationItem } from 'lottie-web';

interface UsePlaybackTickerProps {
  animationRef: RefObject<AnimationItem | null>;
  isPlaying: boolean;
  onFrameUpdate: (frame: number) => void;
}

/**
 * Custom hook to sync lottie-web animation frames with state during playback.
 * Updates the frame counter in real-time as the animation plays.
 */
export function usePlaybackTicker({
  animationRef,
  isPlaying,
  onFrameUpdate,
}: UsePlaybackTickerProps) {
  const frameUpdateRef = useRef(onFrameUpdate);

  // Keep the callback ref up to date
  useEffect(() => {
    frameUpdateRef.current = onFrameUpdate;
  }, [onFrameUpdate]);

  useEffect(() => {
    const animation = animationRef.current;
    if (!animation) return;

    const handleEnterFrame = () => {
      if (animationRef.current && isPlaying) {
        const frame = Math.round(animationRef.current.currentFrame);
        frameUpdateRef.current(frame);
      }
    };

    animation.addEventListener('enterFrame', handleEnterFrame);

    return () => {
      // Check if animation still exists before removing listener
      // Animation might be destroyed when uploading new file
      try {
        animation.removeEventListener('enterFrame', handleEnterFrame);
      } catch (error) {
        // Animation was already destroyed, ignore error
      }
    };
  }, [animationRef, isPlaying]);
}
