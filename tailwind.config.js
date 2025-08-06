/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Alvara Brand Colors
        indigo: {
          50: "#f8f7fa",
          100: "#f0edf5",
          200: "#e1dceb",
          300: "#c9bfd7",
          400: "#a899c0",
          500: "#8b73a8",
          600: "#7a5f95",
          700: "#6a4d7f",
          800: "#5a416a",
          900: "#4d3758",
          950: "#3A234F", // Primary brand color
        },
        flamingo: {
          50: "#fef7f9",
          100: "#fdeef3",
          200: "#fbdde8",
          300: "#f8c3d4",
          400: "#f39db8",
          500: "#ed6f94",
          600: "#e14a75",
          700: "#c9345d",
          800: "#a82d4e",
          900: "#8c2943",
          950: "#FC9FB7", // Brand color
        },
        
        salmon: {
          50: "#fef2f6",
          100: "#fde7f0",
          200: "#fbd0e3",
          300: "#f7a8cc",
          400: "#f175a8",
          500: "#e94a84",
          600: "#d73d80", // Brand color
          700: "#b82e66",
          800: "#9a2754",
          900: "#7f2347",
          950: "#4d1124",
        },
        tangerine: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#FD9355", // Brand color
        },
        midnight: {
          50: "#f8f7fa",
          100: "#f0edf5",
          200: "#e1dceb",
          300: "#c9bfd7",
          400: "#a899c0",
          500: "#8b73a8",
          600: "#7a5f95",
          700: "#6a4d7f",
          800: "#5a416a",
          900: "#4d3758",
          950: "#13061F", // Primary dark color
        },
        steel: {
          50: "#fdfcfe",
          100: "#faf8fd",
          200: "#f5f0fa",
          300: "#ede4f5",
          400: "#e1d2ed",
          500: "#d1b8e2",
          600: "#c19dd4",
          700: "#a97fc2",
          800: "#8f65a8",
          900: "#75548a",
          950: "#D8CDE2", // Brand color
        },
        eggshell: {
          50: "#fefefe",
          100: "#fefefe",
          200: "#fefdfe",
          300: "#fdfbfe",
          400: "#fcf8fd",
          500: "#faf4fc",
          600: "#f6eef9",
          700: "#f0e5f4",
          800: "#e8d8ed",
          900: "#dcc8e3",
          950: "#FDF2FF", // Brand color
        },
        "neon-green": "#00ff88", // Neon green for Alvara NFTs
        // Legacy color mappings for backward compatibility
        primary: {
          50: "#f8f7fa",
          100: "#f0edf5",
          200: "#e1dceb",
          300: "#c9bfd7",
          400: "#a899c0",
          500: "#8b73a8",
          600: "#7a5f95",
          700: "#6a4d7f",
          800: "#5a416a",
          900: "#4d3758",
          950: "#3A234F",
        },
        secondary: {
          50: "#fef7f9",
          100: "#fdeef3",
          200: "#fbdde8",
          300: "#f8c3d4",
          400: "#f39db8",
          500: "#ed6f94",
          600: "#e14a75",
          700: "#c9345d",
          800: "#a82d4e",
          900: "#8c2943",
          950: "#FC9FB7",
        },
        dark: {
          50: "#f8f7fa",
          100: "#f0edf5",
          200: "#e1dceb",
          300: "#c9bfd7",
          400: "#a899c0",
          500: "#8b73a8",
          600: "#7a5f95",
          700: "#6a4d7f",
          800: "#5a416a",
          900: "#4d3758",
          950: "#13061F",
        },
        accent: {
          indigo: "#3A234F",
          flamingo: "#FC9FB7",
          salmon: "#D73D80",
          tangerine: "#FD9355",
          midnight: "#13061F",
          steel: "#D8CDE2",
          eggshell: "#FDF2FF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        gradient: "gradient 8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        gradient: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #3A234F 0%, #D73D80 100%)",
        "gradient-secondary":
          "linear-gradient(135deg, #FC9FB7 0%, #FD9355 100%)",
        "gradient-brand":
          "linear-gradient(135deg, #3A234F 0%, #FC9FB7 50%, #FD9355 100%)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
