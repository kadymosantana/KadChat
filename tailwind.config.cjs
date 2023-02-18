module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        dark: {
          600: '#2f3137',
          700: '#27292e',
          800: '#1f2125',
          900: '#1a1d1e',
        },
      },
    },
    fontFamily: {
      sans: ['Inter'],
    },
  },
  plugins: [],
};
