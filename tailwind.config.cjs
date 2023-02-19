/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.ejs"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bgLogin : '#AA7B28'
      },
      fontFamily: {
        iceland : ['Iceland'],
        montserrat: ['Montserrat']
      },
    },
  },
  plugins: [],
}
