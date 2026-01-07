module.exports = {
  mode: "jit",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./safelist.txt"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      mono: ["ui-monospace", "monospace"],
    },

    screens: {
      xs: "576px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-deep": "var(--primary-deep)",
        "primary-mild": "var(--primary-mild)",
        "primary-subtle": "var(--primary-subtle)",
        error: "var(--error)",
        "error-subtle": "var(--error-subtle)",
        success: "var(--success)",
        "success-subtle": "var(--success-subtle)",
        info: "var(--info)",
        "info-subtle": "var(--info-subtle)",
        warning: "var(--warning)",
        "warning-subtle": "var(--warning-subtle)",
        neutral: "var(--neutral)",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.500"),
            maxWidth: "65ch",
          },
        },
        invert: {
          css: {
            color: theme("colors.gray.400"),
          },
        },
      }),
    },
  },
};
