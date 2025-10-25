#!/bin/bash

# SlimeThis Deploy Script
# Quick deployment to GitHub Pages

echo "🚀 Deploying SlimeThis to GitHub Pages..."

# Add all changes
git add .

# Commit with timestamp
COMMIT_MSG="Deploy $(date +'%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG"

# Push to main branch (triggers GitHub Pages deploy)
git push origin main

echo "✅ Deployment complete! Site updates in 2-10 minutes at https://slimethis.com"

# Optional: Open site in browser
# open https://slimethis.com
