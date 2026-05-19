'use client';

import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import localforage from 'localforage';

export default function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [userCity, setUserCity] = useState('Jakarta');

  const fetchPrayerTimes = useCallback(async () => {
    try {
      const profile = await localforage.getItem('user_profile');
      const city = profile?.location || 'Jakarta';
      setUserCity(city);

      const res = await fetch(`/api/schedule?city=${encodeURIComponent(city)}`);
      if (!res.ok) throw new Error('Gagal memuat jadwal: ' + res.status);
      const data = await res.json();
      const now = dayjs();

      const todayData = data?.schedule?.find((item) =>
        dayjs(item.isoDate).isSame(now, 'day'),
      );
      if (todayData?.timings) {
        setPrayerTimes(todayData.timings);
      }
    } catch (error) {
      console.error('Gagal memuat jadwal sholat:', error);
    }
  }, []);

  useEffect(() => {
    fetchPrayerTimes();

    const handleProfileUpdate = () => {
      fetchPrayerTimes();
    };

    window.addEventListener('user_profile_updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('user_profile_updated', handleProfileUpdate);
    };
  }, [fetchPrayerTimes]);

  return { prayerTimes, userCity, fetchPrayerTimes };
}
