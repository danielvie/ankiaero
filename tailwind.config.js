/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      colors: {
        cockpit: {
          // superfícies
          ink: "#0f172a",
          deep: "#0b1120",
          panel: "#1e293b",
          line: "#334155",
          // texto
          bright: "#f8fafc",
          text: "#e2e8f0",
          soft: "#cbd5e1",
          muted: "#94a3b8",
          dim: "#64748b",
          // accent e feedback
          accent: "#f6b44b",
          green: "#4ade80",
          red: "#f87171"
        }
      }
    }
  },
  plugins: []
};
