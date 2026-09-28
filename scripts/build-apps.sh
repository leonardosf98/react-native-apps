#!/usr/bin/env bash
set -euo pipefail

# ── Exports each Expo app for web and copies to hub/public/apps/<slug> ──

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HUB_APPS_DIR="$REPO_ROOT/hub/public/apps"

# Map of slug → relative path from repo root
declare -A APP_PATHS=(
  ["meu-perfil-profissional"]="app-01-meu-perfil-profissional"
  ["loja-pulse"]="app-02-loja-pulse"
  ["calculadora"]="app-03-calculadora"
  ["alcool-ou-gasolina"]="app-04-alcool-ou-gasolina"
  ["calculo-de-imc"]="app-05-calculo-de-imc"
  ["jogo-numero-aleatorio"]="app-06-jogo-numero-aleatorio"
)

echo "🚀 Building all Expo apps for web..."
echo ""

for slug in "${!APP_PATHS[@]}"; do
  app_dir="$REPO_ROOT/${APP_PATHS[$slug]}"
  target_dir="$HUB_APPS_DIR/$slug"

  echo "────────────────────────────────────"
  echo "📦 Building: $slug"
  echo "   Source:   ${APP_PATHS[$slug]}"
  echo ""

  if [ ! -f "$app_dir/package.json" ]; then
    echo "   ⚠️  Skipping — no package.json found"
    continue
  fi

  # Install deps if needed
  if [ ! -d "$app_dir/node_modules" ]; then
    echo "   📥 Installing dependencies..."
    (cd "$app_dir" && npm install --silent 2>&1 | tail -1)
  fi

  # Export for web
  echo "   🔨 Exporting for web..."
  (cd "$app_dir" && npx expo export --platform web 2>&1 | tail -3)

  # Copy dist to hub/public/apps/<slug>
  dist_dir="$app_dir/dist"
  if [ -d "$dist_dir" ]; then
    rm -rf "$target_dir"
    mkdir -p "$target_dir"
    cp -r "$dist_dir"/* "$target_dir/"

    # Fix asset paths: convert absolute paths (/_expo/) to relative (./_expo/)
    # so Expo exports work correctly inside iframes
    html_file="$target_dir/index.html"
    if [ -f "$html_file" ]; then
      sed -i 's|src="/_expo/|src="./_expo/|g' "$html_file"
      echo "   ✅ Copied to hub/public/apps/$slug/ (paths fixed)"
    else
      echo "   ✅ Copied to hub/public/apps/$slug/"
    fi
  else
    echo "   ⚠️  No dist/ found after export — skipping copy"
  fi

  echo ""
done

echo "────────────────────────────────────"
echo "🎉 All apps exported! Ready to build hub."
