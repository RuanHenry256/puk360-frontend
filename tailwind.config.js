/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {                    // Colours that will be used 
        primary: "#582C94",      // Purple
        secondary: "#257D7A",    // Teal
        text: "#000000",         // Black
        surface: "#FFFFFF",      // White
        accent: "#5FC1AE",       // Blue-green
      },
    },
  },
  plugins: [],
}
