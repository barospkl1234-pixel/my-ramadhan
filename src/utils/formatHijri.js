const CACHE = new Map();

function getFormatter(options) {
  const key = JSON.stringify(options);
  if (CACHE.has(key)) return CACHE.get(key);
  const f = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
    timeZone: 'Asia/Jakarta',
    ...options,
  });
  CACHE.set(key, f);
  return f;
}

const weekdayFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  timeZone: 'Asia/Jakarta',
});

export function formatHijri(date, { format: formatType = 'long', withWeekday = false } = {}) {
  try {
    const d = new Date(date);
    const formatter = getFormatter({
      day: 'numeric',
      month: formatType === 'short' ? 'short' : 'long',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(d);
    const day = parts.find((p) => p.type === 'day')?.value || '';
    const month = parts.find((p) => p.type === 'month')?.value || '';
    const year = parts.find((p) => p.type === 'year')?.value || '';
    const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);
    let result = `${day} ${monthCapitalized} ${year} H`;
    if (withWeekday) {
      const wd = weekdayFormatter.format(d);
      result = `${wd.charAt(0).toUpperCase() + wd.slice(1)}, ${result}`;
    }
    return result;
  } catch {
    return '';
  }
}

export function formatHijriShort(date) {
  try {
    const d = new Date(date);
    const formatter = getFormatter({ day: 'numeric', month: 'short' });
    const parts = formatter.formatToParts(d);
    const day = parts.find((p) => p.type === 'day')?.value || '';
    const month = parts.find((p) => p.type === 'month')?.value || '';
    const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);
    return `${day} ${monthCapitalized}`;
  } catch {
    return '';
  }
}

export function formatHijriMonth(date) {
  try {
    const d = new Date(date);
    const formatter = getFormatter({ month: 'long', year: 'numeric' });
    const parts = formatter.formatToParts(d);
    const month = parts.find((p) => p.type === 'month')?.value || '';
    const year = parts.find((p) => p.type === 'year')?.value || '';
    const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);
    return `${monthCapitalized} ${year} H`;
  } catch {
    return '';
  }
}

export function getHijriDayNumber(date) {
  try {
    const d = new Date(date);
    const formatter = getFormatter({ day: 'numeric' });
    return parseInt(formatter.format(d), 10);
  } catch {
    return 0;
  }
}
