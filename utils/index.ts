// utils/index.ts

/** Vibrate device if supported */
export const vibrate = (pattern: number | number[] = 200) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};

/** Haversine distance between two lat/lng points in metres */
export const haversineDistance = (
  lat1: number, lon1: number,
  lat2: number, lon2: number,
): number => {
  const R   = 6_371_000;
  const φ1  = (lat1 * Math.PI) / 180;
  const φ2  = (lat2 * Math.PI) / 180;
  const Δφ  = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ  = ((lon2 - lon1) * Math.PI) / 180;
  const a   = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

/** Format metres into human-readable string */
export const formatDistance = (metres: number): string =>
  metres < 1000 ? `${Math.round(metres)} m` : `${(metres / 1000).toFixed(1)} km`;

/** Class concatenation helper */
export const cx = (...classes: (string | false | undefined | null)[]): string =>
  classes.filter(Boolean).join(' ');

/** Delay helper */
export const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Format a date string nicely */
export const formatTime = (iso?: string): string => {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
