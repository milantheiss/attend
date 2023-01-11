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
        'unchecked-gradient-1': '#c2beda',
        'unchecked-gradient-2': '#cecfe4',
        'dimmed-gradient-1': '#98A4CD',
        'dimmed-gradient-2': '#7C83C3',
        'delete-gradient-1': '#DE2C2C',
        'delete-gradient-2': '#D83535',
        'background-graywhite': '#02344a',
        'dark-grey': '#464646',
        'special-red': '#FF1F28',
        "light-gray": "#6C7F8C",
      },
      fontFamily:{
        'ubuntu': ['Ubuntu', 'sans-serif']
      },
      spacing:{
        '6.5': '1.625rem',
        '38': '9.5rem',
        '160': '40rem',
        '120': '30rem'
      },
      backgroundImage: {
        "checkmark": "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%222.5%22%20stroke%3D%22#ff006f%22%20class%3D%22w-6%20h-6%22%3E%20%20%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M4.5%2012.75l6%206%209-13.5%22%20%2F%3E%3C%2Fsvg%3E')"
      },
      transitionDelay: {
        '400': '400ms',
      },
      transitionDuration: {
        '400': '400ms',
      },
      translate: {
        '13': '3.25rem',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        'smaller-bounce': {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)',
          },
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        "smaller-bounce": "smaller-bounce 1s ease-in-out infinite",
        refreshSpin: "spin 1s linear"
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
