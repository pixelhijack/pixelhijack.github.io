/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // 1. Scan HTML files in the current directory and any subdirectory (excluding node_modules)
    "./*.html", // Check HTML files in the root directory
    "./**/*.html",
    "!./node_modules", // Explicitly exclude node_modules
    
    // 2. Your secondary pattern for manifest.json
    "./projects/**/manifest.json"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

