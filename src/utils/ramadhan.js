import dayjs from 'dayjs';

const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
  day: 'numeric',
  month: 'numeric',
  timeZone: 'Asia/Jakarta',
});

export function getRamadhanDates() {
  const searchStart = dayjs(`${dayjs().year()}-01-20`);
  const searchEnd = dayjs(`${dayjs().year()}-04-20`);

  for (let d = searchStart; d.isBefore(searchEnd) || d.isSame(searchEnd, 'day'); d = d.add(1, 'day')) {
    const parts = formatter.formatToParts(d.toDate());
    const month = parseInt(parts.find((p) => p.type === 'month')?.value || '0', 10);
    const day = parseInt(parts.find((p) => p.type === 'day')?.value || '0', 10);
    if (month === 9 && day === 1) {
      return {
        start: d,
        end: d.add(29, 'day'),
      };
    }
  }

  return {
    start: dayjs(`${dayjs().year()}-02-19`),
    end: dayjs(`${dayjs().year()}-03-20`),
  };
}

export function getHijriYearNumber() {
  try {
    const parts = formatter.formatToParts(new Date());
    return parseInt(parts.find((p) => p.type === 'year')?.value || '1447', 10);
  } catch {
    return 1447;
  }
}
