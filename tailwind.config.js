/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  safelist: [
    // keep these even if Tailwind can't “see” them statically
    'placeholder-gray-400',
    'placeholder-gray-500',
    'text-gray-900',
  ],
  theme: {
    extend: {
      colors: {
        primary:   "#70298D",
        secondary: "#2596BE",
        text:      "#000000",
        surface:   "#FFFFFF",
        accent:    "#5FC1AE",
        "primary-dm":   "#9B59C3",
        "secondary-dm": "#39B8B3",
        "text-dm":      "#E6E6E6",
        "surface-dm":   "#0F1115",
        "accent-dm":    "#7BE2CD",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
