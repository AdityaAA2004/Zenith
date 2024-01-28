/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar'),
    require("@tailwindcss/forms"),
  ],
  extend: {
    'modal': 'fixed inset-0 bg-opacity-50 bg-black flex flex-col items-center justify-center',
  }
}

