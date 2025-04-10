#!/bin/bash

# Build frontend
vite build

# Build backend
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist