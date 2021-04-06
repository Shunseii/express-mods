const colors = require("tailwindcss/colors");

module.exports = {
  purge: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ["Oswald"],
    },
    extend: {
      colors: {
        coolGray: colors.coolGray,
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
