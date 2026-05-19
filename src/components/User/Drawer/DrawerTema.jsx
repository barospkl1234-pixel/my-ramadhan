'use client';

import { Sun, Moon, Star } from 'lucide-react';
import DrawerPanel from '@/components/_shared/DrawerPanel';

const CrescentMoon = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={className}
  >
    <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
  </svg>
);

const THEMES = [
  {
    id: 'light',
    label: 'Terang',
    icon: Sun,
    desc: 'Tema cerah standar',
  },
  {
    id: 'dark',
    label: 'Gelap',
    icon: Moon,
    desc: 'Tema gelap standar',
  },
  {
    id: 'ramadan-light',
    label: 'Ramadan Terang',
    icon: CrescentMoon,
    desc: 'Nuansa hijau & emas',
  },
  {
    id: 'ramadan-dark',
    label: 'Ramadan Gelap',
    icon: Star,
    desc: 'Malam penuh berkah',
  },
];

const DrawerTema = ({ open, onClose, theme, onToggleTheme }) => (
  <DrawerPanel
    open={open}
    onClose={onClose}
    title='Tema Aplikasi'
    icon={Sun}
    titleColor='text-primary'
  >
    <p className='text-slate-500 dark:text-slate-400 text-[13px]'>
      Pilih tema yang paling nyaman untuk mata Anda.
    </p>

    <div className='grid grid-cols-2 gap-3 mt-4'>
      {THEMES.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.id;

        return (
          <button
            key={t.id}
            onClick={() => onToggleTheme(t.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
              isActive
                ? 'border-primary dark:border-primary bg-primary-bg dark:bg-primary-bg text-primary dark:text-primary'
                : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className='flex items-center justify-center w-10 h-10 mb-2 rounded-xl bg-slate-50 dark:bg-slate-700/50'>
              <Icon size={22} />
            </div>
            <span className='font-bold text-sm'>{t.label}</span>
            <span className='text-[10px] text-slate-400 dark:text-slate-500 mt-0.5'>
              {t.desc}
            </span>
          </button>
        );
      })}
    </div>
  </DrawerPanel>
);

export default DrawerTema;
