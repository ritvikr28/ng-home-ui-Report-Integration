import React, { useEffect, useRef, useState } from "react";

interface UseIsEllipsedProps {
  deps?: any[];
}

export const useIsEllipsed = ({ deps = [] }: UseIsEllipsedProps = {}) => {
  const ref: React.RefObject<HTMLElement | null> = useRef<HTMLElement | null>(null);
  const [isEllipsed, setIsEllipsed]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);

  useEffect(() => {
    const el: HTMLElement | null = ref.current;
    /* istanbul ignore next */
    if (!el) return;

    let frameId: number | null = null;
    let resizeObs: ResizeObserver | null = null;

    /* istanbul ignore next */
    const checkEllipsis: () => void = () => {
      if (!el) return;
      const hasEllipsis: boolean = el.scrollWidth > el.clientWidth;
      // Prevent it from flipping back to false unless it really changes
      setIsEllipsed((prev) => (hasEllipsis ? true : prev));
    };

    const measure: () => void = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(checkEllipsis);
    };

    // Initial measure after mount
    measure();

    resizeObs = new ResizeObserver(measure);
    resizeObs.observe(el);

    // Fallback check after layout stabilizes
    const timer: any = setTimeout(measure, 200);
    
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
