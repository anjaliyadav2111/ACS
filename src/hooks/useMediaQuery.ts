import { useEffect, useState } from 'react';

const getInitialValue = (query: string) => {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return false;
  }
  return window.matchMedia(query).matches;
};

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(getInitialValue(query));

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent | MediaQueryList) => {
      setMatches(event.matches);
    };





    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }

    // Safari fallback
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
};

export default useMediaQuery;

