export const THRESHOLD = 0.7;
export const PRICE_DECIMALS = 3;

function digitsOnly(raw) {
  return String(raw ?? "").replace(/\D/g, "").slice(0, 6);
}

export function maskReais(raw) {
  const digits = digitsOnly(raw);
  if (!digits) return "";
  const value = Number(digits) / 10 ** PRICE_DECIMALS;
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: PRICE_DECIMALS,
    maximumFractionDigits: PRICE_DECIMALS,
  });
}

export function parsePrice(raw) {
  const digits = digitsOnly(raw);
  if (!digits) return null;
  const value = Number(digits) / 10 ** PRICE_DECIMALS;
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

export function compareFuels(ethanol, gasoline) {
  const ratio = ethanol / gasoline;
  if (ratio < THRESHOLD) return { ratio, pick: "etanol" };
  if (ratio > THRESHOLD) return { ratio, pick: "gasolina" };
  return { ratio, pick: "empate" };
}

export function formatRatio(ratio) {
  return ratio.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
