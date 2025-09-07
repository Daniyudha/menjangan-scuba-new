// tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  // Pastikan path ini benar sesuai struktur folder Anda
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-navy': '#0D1B2A',
        'navy': '#1B263B',
        'light-navy': '#415A77',
        'slate': '#778DA9',
        'light-slate': '#E0E1DD',
        'white': '#FFFFFF',
        'bright-blue': '#00BFFF',
        'light-gray': '#F1F5F9',
        'steel-gray': '#64748B'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;