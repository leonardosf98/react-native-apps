# Aether Desk

App final da pasta: help desk com versão **cliente**, **atendente** e **admin**.

Empresa fictícia com placeholders em `mobile/company.js` e `api/src/company.js` (`{{CNPJ}}`, `{{RAZAO_SOCIAL}}`, etc.).

## Como rodar

No **iPhone**, `localhost` é o próprio aparelho. O app aponta para a API na Vercel (`https://react-native-apps.vercel.app`). O Metro usa túnel (`npm start`) para o Expo Go carregar o JS.

O **front web** na Vercel é o export estático do Expo (`npx expo export --platform web`). No projeto `react-native-apps-fewt`, Root Directory = `app-final/mobile`. A API continua em `react-native-apps`.

```bash
cd app-final/mobile
npm install
npm start
```

Backend local (opcional):

```bash
cd app-final/api
npm install
npm run seed
npm run dev
```

```bash
cd app-final/mobile
EXPO_PUBLIC_API_URL=http://localhost:3001 npx expo start --lan
```

## Contas de demo

| Papel | Email | Senha |
|---|---|---|
| Cliente | `cliente@aether.desk` | `Cliente#123` |
| Atendente | `agente@aether.desk` | `Agente#123` |
| Admin | `admin@aether.desk` | `Admin#123` |

## Layout do projeto

```
app-final/
  api/       backend Hono + LibSQL (Vercel)
  mobile/    Expo (cliente, atendente, admin)
```

Um repositório basta: a Vercel publica o subdiretório `api`. Só extraia repos se o time ou o ciclo de release divergirem.

Arquitetura para slides: `leo-vault/personal/faculdade/dispositivos-moveis/aether-desk/`.
