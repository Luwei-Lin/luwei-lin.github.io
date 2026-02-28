#!/bin/bash

# Build the Next.js site
echo "Building the site..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

# Navigate to the output directory
cd out

# Add .nojekyll file
touch .nojekyll

# Copy the static export to the root of the repository
echo "Copying files to repository root..."
cd ../..
rm -rf *.html _next static
cp -r blog-source/out/* .

echo "Deployment files ready! Now commit and push to GitHub:"
echo "  git add ."
echo "  git commit -m 'Deploy blog update'"
echo "  git push origin main"
