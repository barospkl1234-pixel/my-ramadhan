'use client';

export const THEMES = [
  { id: 'light', label: 'Terang' },
  { id: 'dark', label: 'Gelap' },
  { id: 'ramadan-light', label: 'Ramadan Terang' },
  { id: 'ramadan-dark', label: 'Ramadan Gelap' },
];

export function applyTheme(themeId) {
  const html = document.documentElement;
  if (themeId === 'dark' || themeId === 'ramadan-dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  html.setAttribute('data-theme', themeId);
}
