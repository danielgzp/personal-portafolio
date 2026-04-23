import { useSyncExternalStore, useCallback } from 'react';

export function useMediaQuery(query: string) {
  // subscribe: called by React to attach the listener.
  // Must return a cleanup function. Recreated only when `query` changes.
  const subscribe = useCallback((callback: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener('change', callback);
    return () => media.removeEventListener('change', callback);
  }, [query]);

  // getSnapshot: called synchronously by React to read the current value.
  // Must be pure and return the same value if nothing changed.
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query]
  );

  // getServerSnapshot: used during SSR and the first client render.
  // Returns false to match the server output and avoid hydration mismatch.
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}