/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/web/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trust: {
          blue: "#0B28FE",
          dark: "#0F032D",
          black: "#050010",
          gray: "#DCDDDD",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      borderRadius: {
        "3xl": "2rem",
        "4xl": "2.5rem",
      },
      animation: {
        "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
