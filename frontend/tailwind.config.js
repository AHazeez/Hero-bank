/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0e1a',
        bg2: '#111827',
        bg3: '#1a2235',
        bg4: '#243044',
        accent: '#c9a96e',
        accent2: '#e8c98a',
        'accent-dim': '#8a6d3f',
        text: '#f0ede8',
        text2: '#a9b4c8',
        text3: '#6b7a90',
        green: '#4ade80',
        'green-bg': 'rgba(74,222,128,0.08)',
        red: '#f87171',
        'red-bg': 'rgba(248,113,113,0.08)',
        border: 'rgba(201,169,110,0.15)',
        border2: 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        'serif': ['DM Serif Display', 'serif'],
        'sans': ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        'r': '14px',
        'r2': '10px',
        'r3': '6px',
      },
      boxShadow: {
        'default': '0 4px 24px rgba(0,0,0,0.4)',
      }
    },
  },
  plugins: [],
}
