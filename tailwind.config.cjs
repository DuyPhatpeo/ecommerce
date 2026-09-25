/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    borderRadius: {
      none: "0px",
      sm: "0px",
      DEFAULT: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      full: "0px",
    },
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // DINOSPORTS Primary Brand Identity
        primary: {
          DEFAULT: "#78e000", // Official Electric Lime
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#bef264",
          400: "#a3e635",
          500: "#78e000",
          600: "#65a30d",
          700: "#4d7c0f",
          800: "#3f6212",
          900: "#365314",
          neon: "#78e000",
          hover: "#84cc16",
          dark: "#65a30d",
        },
        // Athletic Deep Dark Themes (#001a2c palette)
        dark: {
          DEFAULT: "#000e18",
          bg: "#000e18",
          card: "#001829",
          surface: "#001524",
          deep: "#00080f",
          800: "#001e30",
          900: "#000e18",
          border: "#002b47",
          borderHover: "#003554",
        },
        // Accent Colors
        accent: {
          orange: "#f97316",
          red: "#ef4444",
          blue: "#0284c7",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        neon: "0 0 20px rgba(120, 224, 0, 0.45)",
        "neon-strong": "0 0 35px rgba(120, 224, 0, 0.75)",
        card: "0 4px 20px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
