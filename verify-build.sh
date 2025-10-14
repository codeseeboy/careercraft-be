#!/bin/sh

# Exit on error
set -e

# Verify dist directory exists
if [ ! -d "dist" ]; then
    echo "Error: dist directory not found!"
    exit 1
fi

# Verify index.js exists in dist
if [ ! -f "dist/index.js" ]; then
    echo "Error: dist/index.js not found!"
    exit 1
fi

# List contents of dist directory
echo "Contents of dist directory:"
ls -la dist/

echo "Build verification completed successfully!"