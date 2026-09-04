import { Hono } from "hono";
import { COMPANY } from "../company.js";
import { hashPassword, verifyPassword } from "../password.js";
import { signToken } from "../auth.js";
import { mapUser } from "../db.js";
import {
  jsonError,
  newId,
  nowIso,
  requireRoles,
  ROLES,
  withUser,
} from "../http.js";

export function authRoutes(db) {
  const r = new Hono();

  r.get("/login", (c) => jsonError(c, 405, "Use POST /auth/login"));

  r.post("/login", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    if (!email || !password) return jsonError(c, 400, "Email e senha obrigatórios");

    const result = await db.execute({
      sql: "SELECT * FROM users WHERE email = ? LIMIT 1",
      args: [email],
    });
    const row = result.rows[0];
    if (!row) return jsonError(c, 401, "Credenciais inválidas");
    const ok = await verifyPassword(row.password_hash, password);
    if (!ok || !row.active) return jsonError(c, 401, "Credenciais inválidas");

    const user = mapUser(row);
    const token = await signToken(user);
    return c.json({ token, user, company: COMPANY });
  });

  r.post("/register", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const name = String(body.name || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    if (!name || !email || password.length < 8) {
      return jsonError(c, 400, "Nome, email e senha (mín. 8) obrigatórios");
    }

    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE email = ? LIMIT 1",
      args: [email],
    });
    if (existing.rows[0]) return jsonError(c, 409, "Email já cadastrado");

    const id = newId("usr");
    const stamp = nowIso();
    const passwordHash = await hashPassword(password);
    await db.execute({
      sql: `INSERT INTO users (id, name, email, password_hash, role, active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      args: [id, name, email, passwordHash, ROLES.CLIENTE, stamp, stamp],
    });
    const user = {
      id,
      name,
      email,
      role: ROLES.CLIENTE,
      active: true,
      createdAt: stamp,
      updatedAt: stamp,
    };
    const token = await signToken(user);
    return c.json({ token, user, company: COMPANY }, 201);
  });

  r.get("/me", async (c) => {
    const auth = await withUser(c, db);
    if (auth.error) return jsonError(c, auth.status, auth.error);
    return c.json({ user: auth.user, company: COMPANY });
  });

  r.get("/company", (c) => c.json({ company: COMPANY }));

  return r;
}

export function userRoutes(db) {
  const r = new Hono();

  r.get("/", async (c) => {
    const auth = await withUser(c, db);
    if (auth.error) return jsonError(c, auth.status, auth.error);
    const denied = requireRoles(auth.user, [ROLES.ADMIN, ROLES.ATENDENTE]);
    if (denied) return jsonError(c, denied.status, denied.error);

    const role = c.req.query("role");
    const sql = role
      ? "SELECT * FROM users WHERE role = ? ORDER BY created_at DESC"
      : "SELECT * FROM users ORDER BY created_at DESC";
    const args = role ? [role] : [];
    const result = await db.execute({ sql, args });
    const users = result.rows.map(mapUser);
    if (auth.user.role === ROLES.ATENDENTE) {
      return c.json({
        users: users.filter((u) => u.role !== ROLES.ADMIN),
      });
    }
    return c.json({ users });
  });

  r.get("/:id", async (c) => {
    const auth = await withUser(c, db);
    if (auth.error) return jsonError(c, auth.status, auth.error);
    const id = c.req.param("id");
    if (auth.user.role !== ROLES.ADMIN && auth.user.id !== id) {
      return jsonError(c, 403, "Sem permissão");
    }
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE id = ? LIMIT 1",
      args: [id],
    });
    const user = mapUser(result.rows[0]);
    if (!user) return jsonError(c, 404, "Usuário não encontrado");
    return c.json({ user });
  });

  r.post("/", async (c) => {
    const auth = await withUser(c, db);
    if (auth.error) return jsonError(c, auth.status, auth.error);
    const denied = requireRoles(auth.user, [ROLES.ADMIN]);
    if (denied) return jsonError(c, denied.status, denied.error);

    const body = await c.req.json().catch(() => ({}));
    const name = String(body.name || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    const role = String(body.role || ROLES.CLIENTE);
    if (!name || !email || password.length < 8) {
      return jsonError(c, 400, "Nome, email e senha (mín. 8) obrigatórios");
    }
    if (!Object.values(ROLES).includes(role)) {
      return jsonError(c, 400, "Papel inválido");
    }
    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE email = ? LIMIT 1",
      args: [email],
    });
    if (existing.rows[0]) return jsonError(c, 409, "Email já cadastrado");

    const id = newId("usr");
    const stamp = nowIso();
    await db.execute({
      sql: `INSERT INTO users (id, name, email, password_hash, role, active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
      args: [id, name, email, await hashPassword(password), role, stamp, stamp],
    });
    return c.json(
      {
        user: {
          id,
          name,
          email,
          role,
          active: true,
          createdAt: stamp,
          updatedAt: stamp,
        },
      },
      201
    );
  });

  r.patch("/:id", async (c) => {
    const auth = await withUser(c, db);
    if (auth.error) return jsonError(c, auth.status, auth.error);
    const id = c.req.param("id");
    const isSelf = auth.user.id === id;
    if (auth.user.role !== ROLES.ADMIN && !isSelf) {
      return jsonError(c, 403, "Sem permissão");
    }

    const result = await db.execute({
      sql: "SELECT * FROM users WHERE id = ? LIMIT 1",
      args: [id],
    });
    const current = result.rows[0];
    if (!current) return jsonError(c, 404, "Usuário não encontrado");

    const body = await c.req.json().catch(() => ({}));
    const name = body.name != null ? String(body.name).trim() : current.name;
    const email =
      body.email != null
        ? String(body.email).trim().toLowerCase()
        : current.email;
    let role = current.role;
    let active = current.active;
    if (auth.user.role === ROLES.ADMIN) {
      if (body.role != null) role = String(body.role);
      if (body.active != null) active = body.active ? 1 : 0;
    }
    if (!Object.values(ROLES).includes(role)) {
      return jsonError(c, 400, "Papel inválido");
    }
    if (!name || !email) return jsonError(c, 400, "Nome e email obrigatórios");

    let passwordHash = current.password_hash;
    if (body.password) {
      if (String(body.password).length < 8) {
        return jsonError(c, 400, "Senha deve ter no mínimo 8 caracteres");
      }
      passwordHash = await hashPassword(String(body.password));
    }

    const stamp = nowIso();
    try {
      await db.execute({
        sql: `UPDATE users SET name = ?, email = ?, password_hash = ?, role = ?, active = ?, updated_at = ?
              WHERE id = ?`,
        args: [name, email, passwordHash, role, active, stamp, id],
      });
    } catch {
      return jsonError(c, 409, "Email já cadastrado");
    }

    const updated = await db.execute({
      sql: "SELECT * FROM users WHERE id = ? LIMIT 1",
      args: [id],
    });
    return c.json({ user: mapUser(updated.rows[0]) });
  });

  r.delete("/:id", async (c) => {
    const auth = await withUser(c, db);
    if (auth.error) return jsonError(c, auth.status, auth.error);
    const denied = requireRoles(auth.user, [ROLES.ADMIN]);
    if (denied) return jsonError(c, denied.status, denied.error);
    const id = c.req.param("id");
    if (id === auth.user.id) return jsonError(c, 400, "Não é possível remover a si mesmo");

    const stamp = nowIso();
    const result = await db.execute({
      sql: "UPDATE users SET active = 0, updated_at = ? WHERE id = ?",
      args: [stamp, id],
    });
    if (result.rowsAffected === 0) {
      return jsonError(c, 404, "Usuário não encontrado");
    }
    return c.json({ ok: true });
  });

  return r;
}
