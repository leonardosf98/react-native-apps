# React Native Apps

Repositório com coleção de projetos em React Native. Stack: **Expo SDK 58**.

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
| 11 | Conversor de Moedas | [app-11-conversor-de-moedas](./app-11-conversor-de-moedas) |
| 12 | Abertura de Conta | [app-12-abertura-de-conta](./app-12-abertura-de-conta) |
| 13 | Anúncios de Produtos | [app-13-anuncios-de-produtos](./app-13-anuncios-de-produtos) |
| 14 | Vagas de TI (ScrollView) | [app-14-vagas-ti-scrollview](./app-14-vagas-ti-scrollview) |
| 15 | Vagas de TI (FlatList) | [app-15-vagas-ti-flatlist](./app-15-vagas-ti-flatlist) |
| 16 | Meu Perfil (Bottom Tabs) | [app-16-perfil-bottom-tabs](./app-16-perfil-bottom-tabs) |
| 17 | Meu Perfil (Top Tabs) | [app-17-perfil-top-tabs](./app-17-perfil-top-tabs) |
| 18 | Conversor (Bottom Tabs) | [app-18-conversor-bottom-tabs](./app-18-conversor-bottom-tabs) |
| 19 | Conversor (Top Tabs) | [app-19-conversor-top-tabs](./app-19-conversor-top-tabs) |
| 20 | Frase com Preferências | [app-20-frase-preferencias](./app-20-frase-preferencias) |
| 21 | Lista de Tarefas | [app-21-lista-de-tarefas](./app-21-lista-de-tarefas) |
| 22 | Lista de Compras | [app-22-lista-de-compras](./app-22-lista-de-compras) |
| 23 | Consulta de CEP | [app-23-consulta-cep](./app-23-consulta-cep) |
| 24 | Perfil de Devs | [app-24-perfil-de-devs](./app-24-perfil-de-devs) |
| 25 | App de Filmes | [app-25-filmes](./app-25-filmes) |
| 26 | Conversor de Moedas (API) | [app-26-conversor-moedas-api](./app-26-conversor-moedas-api) |
| 27 | Cadastro de Tarefas | [app-27-cadastro-de-tarefas](./app-27-cadastro-de-tarefas) |

O help desk **Aether Desk** vive em repositório separado: [leonardosf98/aether-desk](https://github.com/leonardosf98/aether-desk).

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
