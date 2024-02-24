/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./build/**/*.{js,jsx,ts,tsx,pug,html}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      height: {
        '70': '70vh',
        '60': '60vh',
        '500': '500px',
        '800': '800px',
      },
      borderRadius: {
        '8xl': '4rem',
      },
      zIndex: {
        '2': '2',
      },
      maxWidth: {
        '200': '200px',
      },
      backgroundColor:{
        'darkslategray' : '#1b3e57'
      },
      textColor:{
        'darkslategray' : '#1b3e57'
      },
      borderColor:{
        'darkslategray' : '#1b3e57'
      }
    },
  },
  plugins: [],
}

