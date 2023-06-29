/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    // './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        70: '17.5rem',
        160: '40rem',
      },
      container: false,
    },
  },
  darkMode: 'media',
  variants: {
    extend: {},
  },
  plugins: [
    function({ addComponents }){
      addComponents({
        '.container': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          '@screen sm': { maxWidth: '640px' },
          '@screen md': { maxWidth: '768px' },
          '@screen lg': { maxWidth: '975px' },
        }
      })
    },
  ],
}
