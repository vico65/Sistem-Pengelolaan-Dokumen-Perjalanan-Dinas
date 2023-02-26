/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.ejs"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        iceland : ['Iceland'],
        montserrat: ['Montserrat']
      },
    },
  },
  plugins: [],
}