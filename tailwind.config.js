/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // use <html class="dark"> or <body class="dark">
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // --- Light (default) ---
        primary:   "#70298D", // NWU purple from the logo
        secondary: "#2596BE", // Teal
        text:      "#000000", // Black
        surface:   "#FFFFFF", // White
        accent:    "#5FC1AE", // Blue-green

        // --- Dark-mode counterparts (use with `dark:` or directly as tokens) ---
        "primary-dm":   "#9B59C3", // a touch lighter & more vibrant for dark bg
        "secondary-dm": "#39B8B3", // brighter teal for contrast
        "text-dm":      "#E6E6E6", // near-white body text
        "surface-dm":   "#0F1115", // app background
        "accent-dm":    "#7BE2CD", // accent that reads on dark
      },
    },
  },
  plugins: [],
};
