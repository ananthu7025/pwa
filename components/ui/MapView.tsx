// components/ui/MapView.tsx
'use client';

import { useEffect, useRef } from 'react';
import { GeoCoords } from '@/hooks/useGeolocation';
import { OfficeLocation } from '@/services/api';

interface MapViewProps {
  userCoords?:   GeoCoords | null;
  officeLocation?: OfficeLocation | null;
  className?:    string;
}

// Dynamically load Leaflet only on the client
export function MapView({ userCoords, officeLocation, className = '' }: MapViewProps) {
  const mapRef       = useRef<HTMLDivElement>(null);
  const leafletMap   = useRef<import('leaflet').Map | null>(null);
  const markersRef   = useRef<import('leaflet').Marker[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Lazy load Leaflet
    import('leaflet').then(L => {
      // Fix default icon paths
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (!leafletMap.current && mapRef.current) {
        const center: [number, number] = officeLocation
          ? [officeLocation.latitude,  officeLocation.longitude]
          : userCoords
          ? [userCoords.latitude, userCoords.longitude]
          : [0, 0];

        leafletMap.current = L.map(mapRef.current, {
          center,
          zoom:          15,
          zoomControl:   false,
          attributionControl: false,
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(leafletMap.current);
      }

      const map = leafletMap.current!;

      // Clear old markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      // Office marker
      if (officeLocation) {
        const officeIcon = L.divIcon({
          html: `<div style="
            width:36px;height:36px;border-radius:50% 50% 50% 0;
            background:#4f46e5;border:3px solid white;
            transform:rotate(-45deg);box-shadow:0 2px 8px rgba(79,70,229,0.6);
          "></div>`,
          className: '',
          iconSize:    [36, 36],
          iconAnchor:  [18, 36],
        });
        const m = L.marker([officeLocation.latitude, officeLocation.longitude], { icon: officeIcon })
          .addTo(map)
          .bindPopup(`<b>${officeLocation.name ?? 'Office'}</b>`);
        markersRef.current.push(m);

        if (officeLocation.radius) {
          L.circle([officeLocation.latitude, officeLocation.longitude], {
            radius: officeLocation.radius,
            color: '#4f46e5', fillColor: '#4f46e5', fillOpacity: 0.08, weight: 1.5,
          }).addTo(map);
        }
      }

      // User marker
      if (userCoords) {
        const userIcon = L.divIcon({
          html: `<div style="
            width:18px;height:18px;border-radius:50%;
            background:#10b981;border:3px solid white;
            box-shadow:0 0 0 4px rgba(16,185,129,0.25);
          "></div>`,
          className: '',
          iconSize:    [18, 18],
          iconAnchor:  [9, 9],
        });
        const m = L.marker([userCoords.latitude, userCoords.longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup('<b>Your location</b>');
        markersRef.current.push(m);
      }

      // Fit bounds to show both markers
      if (officeLocation && userCoords) {
        map.fitBounds([
          [officeLocation.latitude, officeLocation.longitude],
          [userCoords.latitude, userCoords.longitude],
        ], { padding: [60, 60] });
      } else if (officeLocation) {
        map.setView([officeLocation.latitude, officeLocation.longitude], 15);
      } else if (userCoords) {
        map.setView([userCoords.latitude, userCoords.longitude], 15);
      }
    });

    return () => {
      // Don't destroy map on every re-render – only on unmount
    };
  }, [userCoords, officeLocation]);

  // Cleanup on full unmount
  useEffect(() => {
    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className={`w-full h-full ${className}`}
      style={{ minHeight: 280 }}
    />
  );
}
