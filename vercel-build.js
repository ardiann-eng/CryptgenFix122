const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Ensure output directory exists
  const outputDir = './dist';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Build frontend
  console.log('Building frontend...');
  execSync('npx vite build', { stdio: 'inherit' });

  // Build backend
  console.log('Building backend...');
  execSync('npx tsc --project tsconfig.json', { stdio: 'inherit' });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}