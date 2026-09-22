export const ACTIVITY_LEVELS = [
  { key: "sedentary", label: "Sedentário", multiplier: 1.2, description: "Pouco ou nenhum exercício" },
  { key: "light", label: "Levemente ativo", multiplier: 1.375, description: "Exercício leve 1–3 dias/semana" },
  { key: "moderate", label: "Moderadamente ativo", multiplier: 1.55, description: "Exercício moderado 3–5 dias/semana" },
  { key: "active", label: "Muito ativo", multiplier: 1.725, description: "Exercício intenso 6–7 dias/semana" },
  { key: "veryActive", label: "Extremamente ativo", multiplier: 1.9, description: "Exercício muito intenso + trabalho físico" },
];

export function calculateTdee({ sex, weight, height, age, activityKey }) {
  if (!sex || !weight || !height || !age || !activityKey) return null;

  const level = ACTIVITY_LEVELS.find((l) => l.key === activityKey);
  if (!level) return null;

  let bmr;
  if (sex === "male") {
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
  }

  const tdee = bmr * level.multiplier;

  return { bmr: Math.round(bmr), tdee: Math.round(tdee), level };
}
