
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
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });

  // Copy static files
  console.log('Copying static files...');
  if (fs.existsSync('./public')) {
    const publicFiles = fs.readdirSync('./public');
    publicFiles.forEach(file => {
      fs.copyFileSync(
        path.join('./public', file),
        path.join('./dist', file)
      );
    });
  }

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
