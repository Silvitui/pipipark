/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      spacing: {
        'xxs': '0.125rem' // Añadimos el tamaño personalizado
      },
    },
  },
  plugins: [
    require("daisyui"),
    require("tailwindcss-animate")
  ],
};
