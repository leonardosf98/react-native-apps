# React Native Apps

Repositório com coleção de projetos em React Native. Stack: **Expo SDK 57**.

Landing page unificada: [reactapps.leonardosouza.dev](https://reactapps.leonardosouza.dev/)

## Apps

| # | Nome | Pasta |
|---|------|-------|
| 01 | Meu Perfil Profissional | [app-01-meu-perfil-profissional](./app-01-meu-perfil-profissional) |
| 02 | Loja Pulse | [app-02-loja-pulse](./app-02-loja-pulse) |
| 03 | Calculadora | [app-03-calculadora](./app-03-calculadora) |
| 04 | Álcool ou Gasolina | [app-04-alcool-ou-gasolina](./app-04-alcool-ou-gasolina) |
| 05 | Cálculo de IMC | [app-05-calculo-de-imc](./app-05-calculo-de-imc) |
| 06 | Jogo de número aleatório | [app-06-jogo-numero-aleatorio](./app-06-jogo-numero-aleatorio) |
| final | Aether Desk (help desk) | [app-final](./app-final) |

## Hub (Landing Page)

O `hub/` é um app Vite + React Router que lista todos os apps e permite navegá-los via iframe.

### Desenvolvimento

```bash
npm install
npm run dev:hub
```

### Build completo (exporta todos os apps + builda o hub)

```bash
npm run build
```

### Deploy (Vercel)

O `vercel.json` na raiz configura o build do hub. Cada app Expo é exportado para `hub/public/apps/<slug>/` e carregado via iframe.

## Como rodar um app individual

```bash
cd app-02-loja-pulse
npm install
npx expo start
```
