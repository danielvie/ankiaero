/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Aptos", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["Cascadia Mono", "Consolas", "monospace"]
      },
      colors: {
        cockpit: {
          ink: "#08111f",
          panel: "#111c2e",
          line: "#29384f",
          glow: "#00d4ff",
          amber: "#f6b44b",
          green: "#72d48b",
          red: "#ff6b6b"
        }
      }
    }
  },
  plugins: []
};
