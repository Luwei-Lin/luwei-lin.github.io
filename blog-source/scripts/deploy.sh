#!/bin/bash
set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/out"

# Verify the build output exists
if [ ! -d "$OUT_DIR" ]; then
  echo "Error: $OUT_DIR not found. Run 'make deploy-build' first."
  exit 1
fi

# Add .nojekyll so GitHub Pages doesn't strip _next/ assets
touch "$OUT_DIR/.nojekyll"

# Copy built files to repo root
echo "Copying build output to repo root..."
cd "$REPO_ROOT"
# Remove old build artifacts (but not source folders)
find . -maxdepth 1 \( -name "*.html" -o -name "*.txt" -o -name ".nojekyll" \) -delete
rm -rf _next static

cp -r "$OUT_DIR"/. .

# Commit and push
echo "Committing and pushing to GitHub..."
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M')"
git push origin main

echo "Done. Site will be live at https://luwei-lin.github.io in ~1 minute."
