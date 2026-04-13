// hooks/usePolling.ts
import { useEffect, useRef, useCallback } from 'react';

interface UsePollingOptions {
  interval?: number;   // ms, default 5000
  enabled?: boolean;
  onStop?: () => void;
}

/**
 * Calls `fn` immediately, then every `interval` ms while `enabled` is true.
 * Stops automatically when fn returns { stop: true }.
 */
export function usePolling(
  fn: () => Promise<{ stop?: boolean }>,
  { interval = 5_000, enabled = true, onStop }: UsePollingOptions = {},
) {
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted   = useRef(true);
  const fnRef       = useRef(fn);
  fnRef.current     = fn;

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onStop?.();
  }, [onStop]);

  useEffect(() => {
    isMounted.current = true;
    if (!enabled) return;

    const tick = async () => {
      if (!isMounted.current) return;
      try {
        const result = await fnRef.current();
        if (result?.stop) { stop(); return; }
      } catch {
        // silent – caller handles errors via state
      }
      if (isMounted.current) {
        timerRef.current = setTimeout(tick, interval);
      }
    };

    tick();

    return () => {
      isMounted.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, interval, stop]);

  return { stop };
}
