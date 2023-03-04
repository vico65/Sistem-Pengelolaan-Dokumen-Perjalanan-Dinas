/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.ejs"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        iceland : ['Iceland'],
        montserrat: ['Montserrat'],
        inter: ['Inter']
      },
      colors: {
        coklat1 : '#AA7B28',
        coklat2 : '#67460B',
        coklat3 : '#E8C560'
      }
    },
  },
  plugins: [],
}