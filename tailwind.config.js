/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      colors: {
        cockpit: {
          ink: "#08111f",
          deep: "#050c17",
          panel: "#111c2e",
          line: "#29384f",
          edge: "#29384f",
          border: "#29384f",
          active: "#00d4ff",
          activeBg: "#0b2636",
          primary: "#00d4ff",
          glow: "#00d4ff",
          text: "#e5eefb",
          bright: "#ffffff",
          soft: "#cbd5e1",
          muted: "#94a3b8",
          dim: "#64748b",
          amber: "#f6b44b",
          green: "#72d48b",
          red: "#ff6b6b"
        }
      }
    }
  },
  plugins: []
};
