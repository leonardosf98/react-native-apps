# AGENTS

Coleção de apps Expo/React Native com hub unificado. Cada exercício é uma pasta na raiz.

## Pastas

| Pasta | Papel |
|---|---|
| `hub/` | Landing page + SPA (Vite + React Router) que lista e embute todos os apps |
| `scripts/` | Build scripts (export Expo apps → `hub/public/apps/`) |
| `app-NN-slug/` | App de aula, autônomo |
| `app-final/` | Help desk (mobile + api). Só mexer se o pedido for sobre ele. |

Novos exercícios: `app-04-alcool-ou-gasolina`, depois `app-05-…`. Atualize a tabela do `README.md` da raiz.

## Padrão dos apps 01–04

- Expo SDK **57**, React **19.2**, React Native **0.86**
- Entrada: `index.js` registra `./app` com `registerRootComponent`
- UI e estado no `app.js` (e módulos locais se a lógica crescer)
- `app.json` com `name`, `slug`, splash `#0f172a`
- Scripts: `start`, `start:tunnel`, `start:lan`, `android`, `ios`, `web`
- Dependências-base: `expo`, `expo-status-bar`, `expo-asset`, `@expo/metro-runtime`, `@expo/ngrok`, `react`, `react-dom`, `react-native`, `react-native-web`
- Sem TypeScript, sem navegação extra, sem UI kit
- Textos da interface em **português**
- Estilos inline no componente (como 01 e 02)
- Sem comentários no código
- `.gitignore`: `node_modules/`, `.expo/`, `dist/`, `web-build/`

`app-final/mobile` também usa Expo SDK 57, com API própria. Não copie o backend para um exercício simples.

## Como trabalhar

1. Confirme a pasta do app antes de editar.
2. Rode `npm install` só dentro dessa pasta.
3. Não commite a menos que peçam.
4. Não adicione comentários, TODOs ou JSDoc.
5. Prefira nomes e funções pequenas a anotações.

## Rodar

```bash
cd app-04-alcool-ou-gasolina
npm install
npx expo start
```
