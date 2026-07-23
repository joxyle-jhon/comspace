export default {
  "frontend/**/*.{js,jsx,ts,tsx}": [
    "npm --prefix frontend run lint",
    "prettier --write",
  ],
  "frontend/**/*.{css,scss,json,md,yaml,yml}": "prettier --write",
  "backend/**/*.{js,jsx,ts,tsx,css,json,md,yaml,yml}": "prettier --write",
  "backend/**/*.php": "cd backend && ./vendor/bin/pint",
  "*.{json,md,yaml,yml}": "prettier --write",
}
