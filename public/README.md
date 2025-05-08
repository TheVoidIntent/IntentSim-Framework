# IntentSim Framework - Deployment

This directory contains the files used for the public deployment of the IntentSim Framework website.

## Structure

- `index.html` - The main landing page
- `script.js` - The demonstration script
- `dist/` - The compiled TypeScript code (added during build)

## Build Process

The build process (`npm run build`) will:

1. Compile the TypeScript code to JavaScript in the main `dist/` directory
2. Copy the compiled code to `public/dist/` for deployment

## Deployment Settings

When deploying on platforms like Cloudflare Pages, use these settings:

- **Framework preset**: None
- **Build command**: npm run build
- **Build output directory**: public

This ensures that the website is properly deployed with both the static files and the compiled JavaScript code.