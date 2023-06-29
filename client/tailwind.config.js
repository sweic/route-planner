/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      "minHeight": (theme) => ({
        ...theme("spacing")
      })
    }
  },
  plugins: []
};
