import { readToken } from "./auth.js";
import { mapUser } from "./db.js";

export function nowIso() {
  return new Date().toISOString();
}

export function newId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function jsonError(c, status, message) {
  return c.json({ error: message }, status);
}

export async function withUser(c, db) {
  const header = c.req.header("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return { error: "Não autenticado", status: 401 };
  try {
    const payload = await readToken(token);
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE id = ? LIMIT 1",
      args: [payload.sub],
    });
    const user = mapUser(result.rows[0]);
    if (!user || !user.active) {
      return { error: "Sessão inválida", status: 401 };
    }
    return { user };
  } catch {
    return { error: "Sessão inválida", status: 401 };
  }
}

export function requireRoles(user, roles) {
  if (!roles.includes(user.role)) {
    return { error: "Sem permissão", status: 403 };
  }
  return null;
}

export const ROLES = {
  ADMIN: "admin",
  ATENDENTE: "atendente",
  CLIENTE: "cliente",
};

export const STATUSES = [
  "aberto",
  "em_andamento",
  "aguardando_cliente",
  "resolvido",
  "cancelado",
];

export const PRIORITIES = ["baixa", "media", "alta", "urgente"];

export const CATEGORIES = [
  "acesso",
  "financeiro",
  "tecnico",
  "produto",
  "outros",
];
