/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          bg: '#0F1115',
          card: '#181B22',
          border: '#2A2F3D',
          hover: '#20242E',
          muted: '#8B949E'
        },
        royal: {
          500: '#2563EB',
          600: '#1D4ED8',
          400: '#60A5FA',
          900: '#1E3A8A'
        },
        emerald: {
          status: '#10B981',
          glow: 'rgba(16, 185, 129, 0.2)'
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb', // Royal Blue primary accent
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
          950: '#0f172a',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          900: '#0F1115',
          950: '#0F1115', // Enterprise Obsidian background
        }
      },
      borderRadius: {
        'sharp': '4px',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
      keyframes: {
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        telemetryPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'terminal-cursor': 'cursorBlink 1s step-start infinite',
        'telemetry-pulse': 'telemetryPulse 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
