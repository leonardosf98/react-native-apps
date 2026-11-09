export const DEEP = "#064E3B";
export const GREEN = "#059669";
export const MINT = "#ECFDF5";
export const LINE = "#A7F3D0";
export const GOLD = "#F59E0B";
export const TEXT = "#0F2A22";
export const MUTED = "#4B6B60";
export const ERROR = "#DC2626";
export const BG = "#F0FDF7";

export const LIMITE_MIN = 500;
export const LIMITE_MAX = 20000;
export const LIMITE_PASSO = 500;

export const SEXOS = ["Feminino", "Masculino", "Outro", "Prefiro não informar"];

export const ESCOLARIDADES = [
  "Ensino fundamental",
  "Ensino médio",
  "Ensino técnico",
  "Superior incompleto",
  "Superior completo",
  "Pós-graduação",
];

export function formatarMoeda(valor) {
  return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
