export const COLORS = {
  dark: "#431407",
  deep: "#7C2D12",
  orange: "#C2410C",
  amber: "#F59E0B",
  sand: "#FDE7C7",
  cream: "#FFF7ED",
  line: "#FED7AA",
  text: "#2A1205",
  muted: "#8A5A3B",
};

export const RATES = [
  {
    code: "USD",
    tabLabel: "Real → Dólar",
    name: "Dólar americano",
    symbol: "US$",
    flag: "🇺🇸",
    brlPerUnit: 5.42,
    decimals: 2,
  },
  {
    code: "EUR",
    tabLabel: "Real → Euro",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    brlPerUnit: 6.28,
    decimals: 2,
  },
  {
    code: "BTC",
    tabLabel: "Real → Bitcoin",
    name: "Bitcoin",
    symbol: "₿",
    flag: "🪙",
    brlPerUnit: 548300,
    decimals: 8,
  },
];

export const RATES_DATE = "08/11/2026";

export function parseBrl(text) {
  const normalized = String(text || "").replace(/\./g, "").replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : 0;
}

export function formatNumber(value, decimals) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function convert(brl, rate) {
  return brl / rate.brlPerUnit;
}
