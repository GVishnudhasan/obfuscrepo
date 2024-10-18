/** @type {import('tailwindcss').Config} */
export default {
  content: ["./public/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 20s linear infinite",
        marquee: "marquee 20s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },

      backgroundImage: {
        whitelight:
          "linear-gradient(96deg, #FFF -4.79%, rgba(255, 255, 255, 0.35) 98.05%)",
      },
    },
  },
  variants: {},
  plugins: [],
};