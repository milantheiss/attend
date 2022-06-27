/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens:{
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px'
    },
    maxWidth:{
      'medium-width': '40rem'
    },
    extend: {
      colors: {
        'standard-gradient-1': 'rgb(88, 100, 224)',
        'standard-gradient-2': 'rgb(107, 88, 224)',
        'unchecked-gradient-1': '#E1E2EF',
        'unchecked-gradient-2': '#D3D0E4',
        'dimmed-gradient-1': '#98A4CD',
        'dimmed-gradient-2': '#7C83C3',
        'background-greywhite': '#FBFCFF'
      },
      fontFamily:{
        'ubuntu': ['Ubuntu', 'sans-serif']
      },
      spacing:{
        '160': '40rem'
      }
    },
  },
  plugins: [],
}