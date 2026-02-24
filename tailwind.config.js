/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      primary: "#1a1a1a", // Deep Onyx -> Dark Text/Primary
      secondary: "#333333", // Charcoal -> Lighter Dark
      accent: "#000000", // Electric Mint -> Black Accent (high contrast)
      background: "#F2DD5E", // User requested background
      surface: "#F7E68D", // Slightly lighter/shifted version of background for surface
      text: "#1a1a1a", // Dark text for light background
      muted: "#555555", // Darker muted for visibility
      border: "#E0C040", // Darker binding yellow
      sans: ['Retroica', 'system-ui', 'sans-serif'],
      display: ['Retroica', 'sans-serif'],
      mono: ['Retroica', 'monospace'],
      serif: ['Retroica', 'serif'],
      body: ['Retroica', 'sans-serif'],
    },
    fontSize: {
      'display-xl': ['clamp(3rem, 8vw, 8rem)', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
      'display-lg': ['clamp(2.5rem, 6vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      'display-md': ['clamp(2rem, 4vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
    },
    animation: {
      'spin-slow': 'spin 8s linear infinite',
      'float': 'float 3s ease-in-out infinite',
      'fade-in': 'fadeIn 0.6s ease-out',
    },
    keyframes: {
      float: {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' },
      },
      fadeIn: {
        '0%': { opacity: '0', transform: 'translateY(20px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      }
    }
  },
  plugins: [],
}
