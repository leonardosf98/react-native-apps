# App 03 — Calculadora

Exercício original: multiplicar dois números. Este app amplia isso para uma calculadora de quatro operações. Expo SDK 57.

## Como rodar

```bash
cd app-03-calculadora
npm install
npx expo start
```

Web: `npm run web`. Dispositivo físico: Expo Go + QR do Metro.

## O que faz

- Dígitos, vírgula decimal, sinal (±) e porcentagem
- Soma, subtração, multiplicação e divisão
- Encadeamento (`2 + 3 ×` já mostra o parcial)
- `C` limpa, `⌫` apaga o último dígito, `=` fecha a conta
- Divisão por zero vira `Erro`

A conta fica em `calc.js`. A tela fica em `app.js`.
