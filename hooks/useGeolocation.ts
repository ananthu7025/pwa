// hooks/useGeolocation.ts
import { useState, useCallback } from 'react';

export interface GeoCoords { latitude: number; longitude: number; accuracy?: number }
export type GeoStatus = 'idle' | 'loading' | 'success' | 'error' | 'denied';

export function useGeolocation() {
  const [status, setStatus]   = useState<GeoStatus>('idle');
  const [coords, setCoords]   = useState<GeoCoords | null>(null);
  const [error,  setError]    = useState<string | null>(null);

  const getLocation = useCallback((): Promise<GeoCoords> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setStatus('error');
        setError('Geolocation is not supported by this browser.');
        reject(new Error('Geolocation not supported'));
        return;
      }

      setStatus('loading');
      setError(null);

      navigator.geolocation.getCurrentPosition(
        pos => {
          const c: GeoCoords = {
            latitude:  pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy:  pos.coords.accuracy,
          };
          setCoords(c);
          setStatus('success');
          resolve(c);
        },
        err => {
          const msg =
            err.code === err.PERMISSION_DENIED
              ? 'Location permission denied. Please enable it in your browser settings.'
              : err.code === err.POSITION_UNAVAILABLE
              ? 'Location information is unavailable.'
              : 'Location request timed out.';
          setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error');
          setError(msg);
          reject(new Error(msg));
        },
        { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
      );
    });
  }, []);

  return { status, coords, error, getLocation };
}
