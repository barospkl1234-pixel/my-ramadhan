'use client';

import { useState, useCallback } from 'react';
import localforage from 'localforage';
import { CITIES } from '@/data/cities';

function matchCity(rawName) {
  if (!rawName) return null;
  const lower = rawName.toLowerCase().trim();

  for (const city of CITIES) {
    const c = city.toLowerCase();
    if (c === lower) return city;
  }

  for (const city of CITIES) {
    const c = city.toLowerCase();
    if (lower.includes(c) || c.includes(lower)) return city;
  }

  return null;
}

export default function useGeolocation() {
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);

  const detectLocation = useCallback(async () => {
    setLocating(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('GPS tidak didukung di perangkat ini');
      setLocating(false);
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=id`,
            );
            const data = await res.json();
            const rawCity =
              data.address?.city ||
              data.address?.county ||
              data.address?.town ||
              data.address?.municipality ||
              '';

            const matchedCity = matchCity(rawCity);

            if (matchedCity) {
              const currentUser =
                (await localforage.getItem('user_profile')) || {};
              const updatedUser = { ...currentUser, location: matchedCity };
              await localforage.setItem('user_profile', updatedUser);
              window.dispatchEvent(new Event('user_profile_updated'));
              setLocating(false);
              resolve(matchedCity);
            } else {
              setError(`Lokasi "${rawCity}" tidak ditemukan dalam daftar kota`);
              setLocating(false);
              resolve(null);
            }
          } catch {
            setError('Gagal mengambil data lokasi');
            setLocating(false);
            resolve(null);
          }
        },
        () => {
          setError('Gagal mendapatkan lokasi. Pastikan GPS menyala.');
          setLocating(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
      );
    });
  }, []);

  return { detectLocation, locating, error };
}
