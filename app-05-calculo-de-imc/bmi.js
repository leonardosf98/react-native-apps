export function calculateBmi(weight, height) {
  if (!Number.isFinite(weight) || !Number.isFinite(height) || weight <= 0 || height <= 0) {
    return null;
  }

  const value = weight / (height * height);
  let classification = "Obesidade";

  if (value < 18.5) classification = "Abaixo do peso";
  else if (value < 25) classification = "Peso normal";
  else if (value < 30) classification = "Sobrepeso";

  return { value, classification };
}

export function parseNumber(value) {
  const match = String(value).replace(",", ".").match(/\d+(\.\d+)?/);
  if (!match) return null;
  const number = Number(match[0]);
  return Number.isFinite(number) && number > 0 ? number : null;
}
