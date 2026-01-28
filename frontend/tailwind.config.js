/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0f172a",       // dark navy
          card: "#111827",     // premium dark
          accent: "#7c3aed",   // purple
          text: "#e5e7eb"
        }
      }
    },
  },
  plugins: [],
};
