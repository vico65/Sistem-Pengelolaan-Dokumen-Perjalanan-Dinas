/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/*.ejs",
            "./views/**/*.ejs"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        iceland : ['Iceland'],
        montserrat: ['Montserrat'],
        inter: ['Inter'],
        nunito : ['Nunito']
      },
      colors: {
        coklat1 : '#AA7B28',
        coklat2 : '#67460B',
        coklat3 : '#E8C560',
        coklat4: '#362405',
        kuning1 : '#E8C560'
      }
    },
  },
  plugins: [],
}