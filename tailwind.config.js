/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        customPink : '#f03385',
        customBlue : '#00b0f0',
        customBaseBlue:'#7fd6f5',
        customDarkGray : '#343637',
        customlightGray : '#f5f5f5',
 
      },
    },
  },
  plugins: [],
};