/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    prefix: 'daisyui',
    themes: [
      {
        pp: {
          "primary": "#2dd4bf",
          "secondary": "#60a5fa",
          "accent": "#d946ef",
          "neutral": "#2a323c",
          "base-100": "#1d232a",
          "info": "#3abff8",
          "success": "#5eead4",
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
    ],
  },
  theme: {
    extend: {},
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
}

