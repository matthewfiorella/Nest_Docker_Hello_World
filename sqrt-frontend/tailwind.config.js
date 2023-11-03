/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/index.css", "./src/components/not-found/NotFound.tsx","./src/components/register/Register.tsx", "./src/components/login/Login.tsx"],
  theme: {
    extend: {},
  },
  plugins: ['@tailwindcss/forms'],
}

