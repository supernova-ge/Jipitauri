/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          main: "rgb(52, 53, 65)",
          secondary: "#8B2D83",
        },
        white: {
          100: "#e0d8d8",
          200: "#ffffff",
        },
      },
      width: {
        95: "95%",
        50: "50%",
      },
      left: {
        2: "2.5%",
        25: "25%",
      },
    },
    screens: {
      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};
