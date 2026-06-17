import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: { DEFAULT: "#0A0A0B", soft: "#2B2B2E", muted: "#6B6B70" },
        paper: { DEFAULT: "#FAFAF8", card: "#FFFFFF", sunken: "#F2F1EC" },
        "paper-on-dark": { DEFAULT: "#EDF1F8", muted: "#9DB0CE" },
        navy: { DEFAULT: "#0E2F66", deep: "#0A2350", hover: "#0A2350", tint: "#EAF0FA", ring: "#0E2F66", night: "#081B40", glow: "#16306B" },
        accent: { green: "#3FB57A", coral: "#E8615A", amber: "#F2B53C", blue: "#2E73C9" },
        line: "#E8E6DF"
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        "serif-accent": ["var(--font-serif-accent)", "serif"]
      },
      borderRadius: {
        xl2: "1rem",
        "2xl2": "1.25rem"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10,10,11,0.04), 0 8px 24px rgba(10,10,11,0.06)",
        "soft-lg": "0 2px 4px rgba(10,10,11,0.04), 0 16px 48px rgba(10,10,11,0.08)"
      },
      letterSpacing: {
        tight2: "-0.02em"
      }
    },
  },
  plugins: [],
};
export default config;
