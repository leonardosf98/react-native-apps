export const colors = {
  bg: "#F4F8FF",
  bgSoft: "#E8F0FE",
  card: "#FFFFFF",
  primary: "#1D4ED8",
  primaryDark: "#1E3A8A",
  primarySoft: "#DBEAFE",
  text: "#0F172A",
  muted: "#64748B",
  line: "#E2E8F0",
  success: "#0284C7",
  danger: "#BE123C",
  warn: "#C2410C",
};

export const STATUS_META = {
  aberto: { label: "Aberto", color: "#1D4ED8", bg: "#DBEAFE" },
  em_andamento: { label: "Em andamento", color: "#0369A1", bg: "#E0F2FE" },
  aguardando_cliente: { label: "Aguardando", color: "#C2410C", bg: "#FFEDD5" },
  resolvido: { label: "Resolvido", color: "#0F766E", bg: "#CCFBF1" },
  cancelado: { label: "Cancelado", color: "#9F1239", bg: "#FFE4E6" },
};

export const PRIORITY_META = {
  baixa: { label: "Baixa", color: "#64748B" },
  media: { label: "Média", color: "#1D4ED8" },
  alta: { label: "Alta", color: "#C2410C" },
  urgente: { label: "Urgente", color: "#BE123C" },
};

export const CATEGORY_LABEL = {
  acesso: "Acesso",
  financeiro: "Financeiro",
  tecnico: "Técnico",
  produto: "Produto",
  outros: "Outros",
};

export const ROLE_LABEL = {
  admin: "Administração",
  atendente: "Atendente",
  cliente: "Cliente",
};
