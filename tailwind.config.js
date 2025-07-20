/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./assets/css/**/*.css",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ED1C24',
          0: '#000014',
          100: '#000033',
          200: '#000059',
          300: '#00008F',
          400: '#0000CC',
          500: '#2424FF',
          600: '#5757FF',
          700: '#9999FF',
          800: '#CCCCFF',
          900: '#E5E5FF',
          997: '#F0F0FF',
          999: '#FAFAFF'
        },
        netural: {
          0: '#09090B',
          100: '#17171C',
          200: '#282831',
          300: '#40404F',
          400: '#5C5C70',
          500: '#86869C',
          600: '#A2A2B3',
          700: '#C7C7D1',
          800: '#E3E3E8',
          900: '#F4F4F6',
          999: '#F9F9FB'
        },
        white: '#FFFFFF',
        black: '#000000',
        secondary: '#000059',
        indigo: '#5C00F8',
        green: '#00DD00',
        blue: '#92F6F3',
        danger: '#FF0000',
        currentcolor: "currentcolor",
        'titan-white': '#FAFAFF',
        'rose-white': '#FEF6F6',
        transparent: 'transparent'
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
