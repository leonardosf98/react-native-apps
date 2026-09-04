# Aether Desk

App final da pasta: help desk com versão **cliente**, **atendente** e **admin**.

Empresa fictícia com placeholders em `mobile/company.js` e `api/src/company.js` (`{{CNPJ}}`, `{{RAZAO_SOCIAL}}`, etc.).

## Como rodar

Terminal 1 — API (Hono, porta 3001):

```bash
cd app-final/api
npm install
npm run seed
npm run dev
```

Terminal 2 — app Expo:

```bash
cd app-final/mobile
npm install
npx expo start
```

No celular físico, defina o IP da máquina:

```bash
EXPO_PUBLIC_API_URL=http://SEU_IP:3001 npx expo start
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
