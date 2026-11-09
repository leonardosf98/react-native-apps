export const CURRENCIES = [
  { code: "USD", pair: "USDBRL", name: "Dólar", symbol: "US$", flag: "🇺🇸", decimals: 2 },
  { code: "EUR", pair: "EURBRL", name: "Euro", symbol: "€", flag: "🇪🇺", decimals: 2 },
  { code: "BTC", pair: "BTCBRL", name: "Bitcoin", symbol: "₿", flag: "🪙", decimals: 8 },
];

const URL = "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL";

export async function fetchQuotes() {
  let response;
  try {
    response = await fetch(URL);
  } catch {
    throw new Error("Sem conexão com a internet. Verifique sua rede e tente novamente.");
  }
  if (response.status === 429) {
    throw new Error("Limite de consultas da API atingido. Aguarde alguns instantes e tente de novo.");
  }
  if (!response.ok) {
    throw new Error(`A API de cotações respondeu com erro (${response.status}).`);
  }
  const data = await response.json();
  const quotes = {};
  for (const currency of CURRENCIES) {
    const item = data?.[currency.pair];
    const ask = Number(item?.ask);
    if (!item || !Number.isFinite(ask) || ask <= 0) {
      throw new Error("A API retornou uma cotação inválida.");
    }
    quotes[currency.code] = { ask, date: item.create_date, name: item.name };
  }
  return quotes;
}

export function parseBrl(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
}

export function formatNumber(value, decimals) {
  const fixed = Math.abs(value).toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${value < 0 ? "-" : ""}${grouped}${decPart ? `,${decPart}` : ""}`;
}

export function formatDate(createDate) {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(String(createDate || ""));
  if (!match) return String(createDate || "");
  const [, y, m, d, hh, mm, ss] = match;
  return `${d}/${m}/${y} às ${hh}:${mm}:${ss}`;
}
