import { Hono } from "hono";
import { mapTicket } from "../db.js";
import {
  CATEGORIES,
  jsonError,
  newId,
  nowIso,
  PRIORITIES,
  requireRoles,
  ROLES,
  STATUSES,
  withUser,
} from "../http.js";

const TICKET_SELECT = `
  SELECT t.*,
    c.name AS client_name,
    a.name AS agent_name
  FROM tickets t
  JOIN users c ON c.id = t.client_id
  LEFT JOIN users a ON a.id = t.agent_id
`;

async function addEvent(db, { ticketId, actorId, type, payload }) {
  await db.execute({
    sql: `INSERT INTO ticket_events (id, ticket_id, actor_id, type, payload, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      newId("evt"),
      ticketId,
      actorId,
      type,
      payload ? JSON.stringify(payload) : null,
      nowIso(),
    ],
  });
}

async function getTicket(db, id) {
  const result = await db.execute({
    sql: `${TICKET_SELECT} WHERE t.id = ? LIMIT 1`,
    args: [id],
  });
  return mapTicket(result.rows[0]);
}

function canSeeTicket(user, ticket) {
  if (user.role === ROLES.ADMIN || user.role === ROLES.ATENDENTE) return true;
  return ticket.clientId === user.id;
}

export function ticketRoutes(db) {
  const r = new Hono();

  r.get("/", async (c) => {
    const auth = await withUser(c, db);
    if (auth.error) return jsonError(c, auth.status, auth.error);

    const status = c.req.query("status");
    const mine = c.req.query("mine") === "1";
    const clauses = [];
    const args = [];

    if (auth.user.role === ROLES.CLIENTE) {
      clauses.push("t.client_id = ?");
      args.push(auth.user.id);
    } else if (mine) {
      clauses.push("t.agent_id = ?");
      args.push(auth.user.id);
    }

    if (status) {
      clauses.push("t.status = ?");
      args.push(status);
    }

    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const result = await db.execute({
      sql: `${TICKET_SELECT} ${where} ORDER BY t.created_at DESC`,
      args,
    });
    return c.json({ tickets: result.rows.map(mapTicket) });
  });

  r.get("/:id", async (c) => {
    const auth = await withUser(c, db);
    if (auth.error) return jsonError(c, auth.status, auth.error);
    const ticket = await getTicket(db, c.req.param("id"));
    if (!ticket) return jsonError(c, 404, "Chamado não encontrado");
    if (!canSeeTicket(auth.user, ticket)) {
      return jsonError(c, 403, "Sem permissão");
    }
    const events = await db.execute({
      sql: `SELECT e.*, u.name AS actor_name
            FROM ticket_events e
            JOIN users u ON u.id = e.actor_id
            WHERE e.ticket_id = ?
            ORDER BY e.created_at ASC`,
      args: [ticket.id],
    });
    return c.json({
      ticket,
      events: events.rows.map((row) => ({
        id: row.id,
        ticketId: row.ticket_id,
        actorId: row.actor_id,
        actorName: row.actor_name,
        type: row.type,
        payload: row.payload ? JSON.parse(row.payload) : null,
        createdAt: row.created_at,
      })),
    });
  });

  r.post("/", async (c) => {
    const auth = await withUser(c, db);
    if (auth.error) return jsonError(c, auth.status, auth.error);

    const body = await c.req.json().catch(() => ({}));
    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();
    const priority = String(body.priority || "media");
    const category = String(body.category || "outros");
    if (!title || !description) {
      return jsonError(c, 400, "Título e descrição obrigatórios");
    }
    if (!PRIORITIES.includes(priority)) {
      return jsonError(c, 400, "Prioridade inválida");
    }
    if (!CATEGORIES.includes(category)) {
      return jsonError(c, 400, "Categoria inválida");
    }

    let clientId = auth.user.id;
    if (auth.user.role !== ROLES.CLIENTE && body.clientId) {
      clientId = String(body.clientId);
    }

    const id = newId("tkt");
    const stamp = nowIso();
    await db.execute({
      sql: `INSERT INTO tickets (id, title, description, status, priority, category, client_id, agent_id, created_at, updated_at)
            VALUES (?, ?, ?, 'aberto', ?, ?, ?, NULL, ?, ?)`,
      args: [id, title, description, priority, category, clientId, stamp, stamp],
    });
    await addEvent(db, {
      ticketId: id,
      actorId: auth.user.id,
      type: "created",
      payload: { title, priority, category },
    });
    return c.json({ ticket: await getTicket(db, id) }, 201);
  });

  r.patch("/:id", async (c) => {
    const auth = await withUser(c, db);
    if (auth.error) return jsonError(c, auth.status, auth.error);
    const ticket = await getTicket(db, c.req.param("id"));
    if (!ticket) return jsonError(c, 404, "Chamado não encontrado");
    if (!canSeeTicket(auth.user, ticket)) {
      return jsonError(c, 403, "Sem permissão");
    }

    const body = await c.req.json().catch(() => ({}));
    const staff = [ROLES.ADMIN, ROLES.ATENDENTE].includes(auth.user.role);

    let title = ticket.title;
    let description = ticket.description;
    let priority = ticket.priority;
    let category = ticket.category;
    let status = ticket.status;
    let agentId = ticket.agentId;

    if (body.title != null || body.description != null) {
      if (!staff && ticket.clientId !== auth.user.id) {
        return jsonError(c, 403, "Sem permissão");
      }
      if (!staff && ticket.status !== "aberto") {
        return jsonError(c, 400, "Só é possível editar chamados abertos");
      }
      if (body.title != null) title = String(body.title).trim();
      if (body.description != null) description = String(body.description).trim();
    }

    if (body.priority != null) {
      if (!staff) return jsonError(c, 403, "Sem permissão");
      priority = String(body.priority);
    }
    if (body.category != null) {
      if (!staff) return jsonError(c, 403, "Sem permissão");
      category = String(body.category);
    }
    if (body.status != null) {
      status = String(body.status);
      if (!STATUSES.includes(status)) return jsonError(c, 400, "Status inválido");
      if (!staff) {
        if (status !== "cancelado" || ticket.clientId !== auth.user.id) {
          return jsonError(c, 403, "Sem permissão para alterar status");
        }
      }
    }
    if (body.agentId !== undefined) {
      if (!staff) return jsonError(c, 403, "Sem permissão");
      agentId = body.agentId ? String(body.agentId) : null;
      if (agentId) {
        const agent = await db.execute({
          sql: "SELECT id, role, active FROM users WHERE id = ? LIMIT 1",
          args: [agentId],
        });
        const row = agent.rows[0];
        if (!row || !row.active || ![ROLES.ATENDENTE, ROLES.ADMIN].includes(row.role)) {
          return jsonError(c, 400, "Atendente inválido");
        }
      }
    }

    if (!title || !description) {
      return jsonError(c, 400, "Título e descrição obrigatórios");
    }
    if (!PRIORITIES.includes(priority)) return jsonError(c, 400, "Prioridade inválida");
    if (!CATEGORIES.includes(category)) return jsonError(c, 400, "Categoria inválida");

    const stamp = nowIso();
    await db.execute({
      sql: `UPDATE tickets
            SET title = ?, description = ?, status = ?, priority = ?, category = ?, agent_id = ?, updated_at = ?
            WHERE id = ?`,
      args: [title, description, status, priority, category, agentId, stamp, ticket.id],
    });

    if (status !== ticket.status) {
      await addEvent(db, {
        ticketId: ticket.id,
        actorId: auth.user.id,
        type: "status",
        payload: { from: ticket.status, to: status },
      });
    }
    if (agentId !== ticket.agentId) {
      await addEvent(db, {
        ticketId: ticket.id,
        actorId: auth.user.id,
        type: "assigned",
        payload: { from: ticket.agentId, to: agentId },
      });
    }
    if (title !== ticket.title || description !== ticket.description) {
      await addEvent(db, {
        ticketId: ticket.id,
        actorId: auth.user.id,
        type: "updated",
        payload: { title, description },
      });
    }

    return c.json({ ticket: await getTicket(db, ticket.id) });
  });

  r.delete("/:id", async (c) => {
    const auth = await withUser(c, db);
    if (auth.error) return jsonError(c, auth.status, auth.error);
    const denied = requireRoles(auth.user, [ROLES.ADMIN]);
    if (denied) return jsonError(c, denied.status, denied.error);
    const id = c.req.param("id");
    await db.execute({
      sql: "DELETE FROM ticket_events WHERE ticket_id = ?",
      args: [id],
    });
    const result = await db.execute({
      sql: "DELETE FROM tickets WHERE id = ?",
      args: [id],
    });
    if (result.rowsAffected === 0) {
      return jsonError(c, 404, "Chamado não encontrado");
    }
    return c.json({ ok: true });
  });

  return r;
}

export function notificationRoutes(db) {
  const r = new Hono();

  r.get("/", async (c) => {
    const auth = await withUser(c, db);
    if (auth.error) return jsonError(c, auth.status, auth.error);
    const denied = requireRoles(auth.user, [ROLES.ADMIN, ROLES.ATENDENTE]);
    if (denied) return jsonError(c, denied.status, denied.error);

    const since = c.req.query("since") || "1970-01-01T00:00:00.000Z";
    const result = await db.execute({
      sql: `SELECT e.*, t.title AS ticket_title, t.status AS ticket_status, u.name AS actor_name
            FROM ticket_events e
            JOIN tickets t ON t.id = e.ticket_id
            JOIN users u ON u.id = e.actor_id
            WHERE e.created_at > ?
              AND e.type IN ('created', 'assigned', 'status')
            ORDER BY e.created_at DESC
            LIMIT 50`,
      args: [since],
    });

    return c.json({
      notifications: result.rows.map((row) => ({
        id: row.id,
        ticketId: row.ticket_id,
        ticketTitle: row.ticket_title,
        type: row.type,
        payload: row.payload ? JSON.parse(row.payload) : null,
        actorName: row.actor_name,
        createdAt: row.created_at,
      })),
    });
  });

  return r;
}
