export const REFERENCE_DATE = "08/11/2026";

export const CURRENCIES = [
  { code: "USD", name: "Dólar americano", flag: "🇺🇸", rate: 5.4, decimals: 2 },
  { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 6.25, decimals: 2 },
  { code: "GBP", name: "Libra esterlina", flag: "🇬🇧", rate: 7.2, decimals: 2 },
  { code: "BTC", name: "Bitcoin", flag: "₿", rate: 580000, decimals: 8 },
];

const MAX_AMOUNT = 1000000000000;

export function parseAmount(text) {
  const value = String(text || "").replace(/\s|R\$/g, "");
  if (!value) return { error: "Digite um valor em reais." };

  let normalized = null;
  if (/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(value)) {
    normalized = value.replace(/\./g, "").replace(",", ".");
  } else if (/^\d+([.,]\d{1,2})?$/.test(value)) {
    normalized = value.replace(",", ".");
  }

  if (normalized === null) {
    return { error: "Valor inválido. Use apenas números, como 150 ou 1.250,90." };
  }

  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "O valor precisa ser maior que zero." };
  }
  if (amount > MAX_AMOUNT) {
    return { error: "Valor muito alto. Tente algo até R$ 1 trilhão." };
  }

  return { amount };
}

export function formatBrl(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatCurrency(value, currency) {
  if (currency.code === "BTC") {
    const number = value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: currency.decimals,
    });
    return `₿ ${number}`;
  }
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: currency.code }).format(value);
}

export function convert(amount, currency) {
  return amount / currency.rate;
}
