import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
    }),
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'card': 'bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm',
    'btn-primary': 'bg-emerald-500 text-white rounded-xl py-3 px-6 font-medium active:bg-emerald-600 transition-colors',
    'btn-secondary': 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl py-3 px-6 font-medium',
  },
  theme: {
    colors: {
      primary: {
        DEFAULT: '#10B981',
        light: '#34D399',
        dark: '#059669',
      },
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
    },
  },
})