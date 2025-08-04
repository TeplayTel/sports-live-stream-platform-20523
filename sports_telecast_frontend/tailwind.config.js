/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#1a1a1a',
        'secondary-bg': '#2d2d2d', 
        'tertiary-bg': '#3a3a3a',
        'accent-red': '#e74c3c',
        'accent-blue': '#3498db',
        'accent-green': '#27ae60',
        'text-primary': '#ffffff',
        'text-secondary': '#b0b0b0',
        'text-muted': '#808080',
        'border-color': '#404040',
        'hover-bg': '#4a4a4a',
        'active-bg': '#5a5a5a'
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px'
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px'
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'full': '50%'
      },
      fontFamily: {
        'primary': ['"Roboto"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        'mono': ['"Monaco"', '"Consolas"', 'monospace']
      },
      boxShadow: {
        'level-1': '0 2px 4px rgba(0,0,0,0.1)',
        'level-2': '0 4px 8px rgba(0,0,0,0.15)',
        'level-3': '0 8px 16px rgba(0,0,0,0.2)'
      }
    },
  },
  plugins: [],
}
