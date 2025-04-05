/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors (based on the white background and orange accents)
        primary: {
          light: '#FFFFFF', // Light mode background
          dark: '#1A1A1A',  // Dark mode background
        },
        secondary: {
          light: '#FF6B00', // Orange accent (light mode)
          dark: '#FF8C00',  // Slightly adjusted orange for dark mode contrast
        },
        text: {
          light: '#000000', // Black text for light mode
          dark: '#FFFFFF',  // White text for dark mode
        },
        gray: {
          light: '#F5F5F5', // Light gray for borders/sidebars (light mode)
          dark: '#2D2D2D',  // Dark gray for borders/sidebars (dark mode)
        },
        accent: {
          green: '#10B981', // Green for buttons/icons (e.g., "New chat" icon)
        },
      },
    },
  },
  darkMode: 'class', // Enables dark mode via a class (e.g., `dark`)
} 