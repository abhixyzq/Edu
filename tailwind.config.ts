import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f4fafd',
        surface: '#f4fafd',
        'surface-container': '#e8eff1',
        'surface-container-low': '#eef5f7',
        'surface-container-high': '#e2e9ec',
        'surface-container-highest': '#dde4e6',
        'surface-container-lowest': '#ffffff',
        'on-surface': '#161d1f',
        'on-surface-variant': '#564338',
        primary: '#9b4500',
        'primary-container': '#ff8c42',
        'on-primary': '#ffffff',
        'on-primary-container': '#6a2d00',
        'primary-fixed': '#ffdbc9',
        'primary-fixed-dim': '#ffb68d',
        secondary: '#0060ac',
        'secondary-container': '#68abff',
        'secondary-fixed': '#d4e3ff',
        'on-secondary-fixed': '#001c39',
        tertiary: '#3a6a00',
        'tertiary-container': '#6dbf00',
        'tertiary-fixed': '#a1fa49',
        'tertiary-fixed-dim': '#87dc2c',
        'on-tertiary-fixed': '#0e2000',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        outline: '#897266',
        'outline-variant': '#ddc1b3',
      },
      fontFamily: {
        heading: ['Quicksand', 'sans-serif'],
        sans: ['Nunito Sans', 'sans-serif'],
        logo: ['Outfit', 'sans-serif'],
        brand: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
