'use client';

import { formatHijri, getHijriDayNumber } from '@/utils/formatHijri';

const useHijriDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const hijriDate = formatHijri(yesterday);
  const hijriDay = getHijriDayNumber(yesterday);

  return { hijriDate, hijriDay };
};

export default useHijriDate;
