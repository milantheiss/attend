/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens:{
      ty: '340px',
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
        'delete-gradient-1': '#DE2C2C',
        'delete-gradient-2': '#D83535',
        'background-greywhite': '#edf0f2',
        'dark-grey': '#464646',
        'special-red': '#FF1F28F'
      },
      fontFamily:{
        'ubuntu': ['Ubuntu', 'sans-serif']
      },
      spacing:{
        '6.5': '1.625rem',
        '160': '40rem',
        '120': '30rem'
      }
    },
  },
  plugins: [],
}
