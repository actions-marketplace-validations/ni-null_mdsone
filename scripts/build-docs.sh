#!/bin/bash
# Build and generate documentation locally

set -e

echo "[1/4] Building mdsone package..."
npm run build

echo "[2/4] Creating output directory..."
mkdir -p docs-dist

echo "[3/4] Building single-locale pages..."
npx mdsone ./docs/[en] -m -o ./docs-dist/en.html --template normal --site-title "MDSone Documentation - English"
npx mdsone ./docs/[zh-TW] -m -o ./docs-dist/zh-TW.html --template normal --site-title "MDSone Documentation - Traditional Chinese"

echo "[4/4] Building combined i18n page..."
npx mdsone ./docs --i18n-mode=zh-TW --template normal --site-title "MDSone Documentation" -o ./docs-dist/index.html

echo "Done. Output directory: ./docs-dist"
echo "Generated files:"
echo "  - en.html"
echo "  - zh-TW.html"
echo "  - index.html"
