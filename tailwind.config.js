/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Asegúrate de incluir los archivos correctos
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")], // Agregamos el plugin correctamente
};
