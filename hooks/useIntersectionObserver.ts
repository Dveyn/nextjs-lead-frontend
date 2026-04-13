import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

interface UseIntersectionObserverReturn {
  ref: React.RefObject<Element>;
  isVisible: boolean;
  entry: IntersectionObserverEntry | null;
}

/**
 * useIntersectionObserver
 * A custom hook for lazy loading and visibility detection using the Intersection Observer API.
 *
 * @param options - IntersectionObserver options + optional freezeOnceVisible flag
 * @returns { ref, isVisible, entry }
 */
const useIntersectionObserver = ({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverReturn => {
  const ref = useRef<Element>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const frozen = freezeOnceVisible && isVisible;

  useEffect(() => {
    const node = ref.current;
    if (!node || frozen) return;

    const observerParams: IntersectionObserverInit = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(([observerEntry]) => {
      setEntry(observerEntry);
      setIsVisible(observerEntry.isIntersecting);
    }, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, frozen]);

  return { ref, isVisible, entry };
};

export default useIntersectionObserver;
export type { UseIntersectionObserverOptions, UseIntersectionObserverReturn };
