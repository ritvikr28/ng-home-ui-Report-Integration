import { useEffect, useRef, useState } from "react";

interface UseIsEllipsedProps {
  deps?: any[];
}

export const useIsEllipsed = ({ deps = [] }: UseIsEllipsedProps = {}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isEllipsed, setIsEllipsed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frameId: number | null = null;
    let resizeObs: ResizeObserver | null = null;

    const checkEllipsis = () => {
      if (!el) return;
      const hasEllipsis = el.scrollWidth > el.clientWidth;
      // Prevent it from flipping back to false unless it really changes
      setIsEllipsed((prev) => (hasEllipsis ? true : prev));
    };

    const measure = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(checkEllipsis);
    };

    // Initial measure after mount
    measure();

    resizeObs = new ResizeObserver(measure);
    resizeObs.observe(el);

    // Fallback check after layout stabilizes
    const timer = setTimeout(measure, 200);
    
    // eslint-disable-next-line
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (resizeObs) resizeObs.disconnect();
      clearTimeout(timer);
    };
    // eslint-disable-next-line consistent-return
  }, deps);

  return { ref, isEllipsed };
};
