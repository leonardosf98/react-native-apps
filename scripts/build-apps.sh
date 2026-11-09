#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HUB_APPS_DIR="$REPO_ROOT/hub/public/apps"

APPS=(
  "meu-perfil-profissional:app-01-meu-perfil-profissional"
  "loja-pulse:app-02-loja-pulse"
  "calculadora:app-03-calculadora"
  "alcool-ou-gasolina:app-04-alcool-ou-gasolina"
  "calculo-de-imc:app-05-calculo-de-imc"
  "jogo-numero-aleatorio:app-06-jogo-numero-aleatorio"
  "conversor-de-moedas:app-11-conversor-de-moedas"
  "abertura-de-conta:app-12-abertura-de-conta"
  "anuncios-de-produtos:app-13-anuncios-de-produtos"
  "vagas-ti-scrollview:app-14-vagas-ti-scrollview"
  "vagas-ti-flatlist:app-15-vagas-ti-flatlist"
  "perfil-bottom-tabs:app-16-perfil-bottom-tabs"
  "perfil-top-tabs:app-17-perfil-top-tabs"
  "conversor-bottom-tabs:app-18-conversor-bottom-tabs"
  "conversor-top-tabs:app-19-conversor-top-tabs"
  "frase-preferencias:app-20-frase-preferencias"
  "lista-de-tarefas:app-21-lista-de-tarefas"
  "lista-de-compras:app-22-lista-de-compras"
  "consulta-cep:app-23-consulta-cep"
  "perfil-de-devs:app-24-perfil-de-devs"
  "filmes:app-25-filmes"
  "conversor-moedas-api:app-26-conversor-moedas-api"
  "cadastro-de-tarefas:app-27-cadastro-de-tarefas"
)

FILTER=("$@")

wanted() {
  [ "${#FILTER[@]}" -eq 0 ] && return 0
  for w in "${FILTER[@]}"; do [ "$w" = "$1" ] && return 0; done
  return 1
}

export_app() {
  local slug="$1" app_dir="$2" target_dir="$HUB_APPS_DIR/$1"
  local original
  original="$(cat "$app_dir/app.json")"

  # Assets (fonts, navigation icons) are emitted with absolute URLs, so the bundle must know it lives under /apps/<slug>.
  node -e '
    const fs = require("fs");
    const [file, base] = process.argv.slice(1);
    const json = JSON.parse(fs.readFileSync(file, "utf8"));
    json.expo.experiments = { ...(json.expo.experiments || {}), baseUrl: base };
    fs.writeFileSync(file, JSON.stringify(json, null, 2) + "\n");
  ' "$app_dir/app.json" "/apps/$slug"

  rm -rf "$app_dir/dist"
  (cd "$app_dir" && npx expo export --platform web 2>&1 | tail -2)
  printf '%s\n' "$original" > "$app_dir/app.json"

  if [ ! -f "$app_dir/dist/index.html" ]; then
    echo "   ⚠️  export falhou para $slug"
    return 1
  fi

  rm -rf "$target_dir"
  mkdir -p "$target_dir"
  cp -r "$app_dir/dist"/. "$target_dir/"
  rm -rf "$app_dir/dist"

  if [ -d "$target_dir/assets/node_modules" ]; then
    mv "$target_dir/assets/node_modules" "$target_dir/assets/vendor"
    grep -rl "/assets/node_modules/" "$target_dir/_expo" | xargs -r sed -i "s|/apps/$slug/assets/node_modules/|/apps/$slug/assets/vendor/|g"
  fi
  echo "   ✅ hub/public/apps/$slug"
}

for entry in "${APPS[@]}"; do
  slug="${entry%%:*}"
  dir="${entry#*:}"
  wanted "$slug" || continue
  app_dir="$REPO_ROOT/$dir"

  echo "📦 $slug ($dir)"
  if [ ! -f "$app_dir/package.json" ]; then
    echo "   ⚠️  sem package.json, pulando"
    continue
  fi
  if [ ! -d "$app_dir/node_modules" ]; then
    (cd "$app_dir" && npm install --silent 2>&1 | tail -1)
  fi
  export_app "$slug" "$app_dir"
done

echo "🎉 Apps exportados para hub/public/apps"
