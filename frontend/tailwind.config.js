/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16233D",
        paper: "#F4F6F8",
        surface: "#FFFFFF",
        accent: {
          DEFAULT: "#C9832E",
          light: "#E8B368",
          dark: "#A6691F",
        },
        positive: {
          DEFAULT: "#3F8F5F",
          light: "#E4F1E8",
        },
        alert: {
          DEFAULT: "#B5493B",
          light: "#F6E5E2",
        },
        slate: {
          DEFAULT: "#5B6B7C",
          light: "#8C99A6",
        },
        entity: {
          disease: "#B5493B",
          medication: "#3F6FA8",
          dosage: "#8B5FBF",
          test: "#3F8F5F",
        },
      },
      fontFamily: {
        display: ["Newsreader", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
