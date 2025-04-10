// Script untuk proses build di Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Fungsi untuk menjalankan perintah shell dengan output yang ditampilkan
function runCommand(command) {
  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit' });
}

// Direktori output
const outputDir = './dist';

// Pastikan direktori output ada
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Build frontend dengan Vite
console.log('Building frontend...');
runCommand('npx vite build');

// Build backend dengan esbuild
console.log('Building backend...');
runCommand('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist');

// Salin file statis ke direktori output
console.log('Copying static files...');
if (fs.existsSync('./client/public')) {
  runCommand('cp -r ./client/public/* ./dist/');
}

console.log('Build completed successfully!');