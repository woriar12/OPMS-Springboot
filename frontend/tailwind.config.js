/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: "#F8FAFC",
        primaryBlue: "#2563EB",
        primaryIndigo: "#4F46E5",
        primaryPurple: "#7C3AED",
        textMain: "#0F172A",
        textSecondary: "#64748B",
        borderLight: "#E2E8F0",
        cardBg: "#FFFFFF",
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'card': '0 10px 25px -5px rgba(37, 99, 235, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
