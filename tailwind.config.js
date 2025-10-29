/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./**/*.html", // Scan all HTML files in the current directory and subdirectories
    "./projects/**/manifest.json" // Scan manifest.json files in projects subdirectories
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

