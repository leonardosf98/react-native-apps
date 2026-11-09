export const RATES_DATE = "08/11/2026";

export const CURRENCIES = {
  USD: {
    code: "USD",
    name: "Dólar americano",
    tab: "Dólar",
    symbol: "US$",
    rate: 5.42,
    decimals: 2,
    icon: "logo-usd",
    accent: "#16A34A",
    soft: "#DCFCE7",
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    tab: "Euro",
    symbol: "€",
    rate: 5.87,
    decimals: 2,
    icon: "logo-euro",
    accent: "#2563EB",
    soft: "#DBEAFE",
  },
  BTC: {
    code: "BTC",
    name: "Bitcoin",
    tab: "Bitcoin",
    symbol: "₿",
    rate: 548320.0,
    decimals: 8,
    icon: "logo-bitcoin",
    accent: "#EA580C",
    soft: "#FFEDD5",
  },
};

export function formatNumber(value, decimals) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatBrl(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function parseBrl(text) {
  const clean = String(text || "").trim().replace(/^R\$\s*/, "");
  if (!clean) return { empty: true };
  if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/.test(clean)) {
    return { error: "Use apenas números, com até 2 casas decimais (ex.: 1.250,50)." };
  }
  const value = Number(clean.replace(/\./g, "").replace(",", "."));
  if (value <= 0) return { error: "Informe um valor maior que zero." };
  if (value > 1000000000) return { error: "O valor máximo é R$ 1.000.000.000,00." };
  return { value };
}

export function convert(valueBrl, currency) {
  return valueBrl / currency.rate;
}
