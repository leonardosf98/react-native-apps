import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const defaultFile = join(here, "..", "data", "aether.db");

function dbPath() {
  if (process.env.VERCEL) return ":memory:";
  if (process.env.DATABASE_URL?.startsWith("file:")) {
    return process.env.DATABASE_URL.replace(/^file:\/\//, "").replace(/^file:/, "");
  }
  return defaultFile;
}

function wrap(sqlite) {
  return {
    async execute(query) {
      const sql = typeof query === "string" ? query : query.sql;
      const args = typeof query === "string" ? [] : query.args ?? [];
      const head = sql.trim().slice(0, 12).toUpperCase();
      if (head.startsWith("SELECT") || head.startsWith("WITH ")) {
        return { rows: sqlite.prepare(sql).all(...args) };
      }
      if (head.startsWith("CREATE")) {
        sqlite.exec(sql);
        return { rows: [], rowsAffected: 0 };
      }
      const result = sqlite.prepare(sql).run(...args);
      return { rows: [], rowsAffected: result.changes };
    },
  };
}

export function createDb() {
  const path = dbPath();
  if (path !== ":memory:") {
    mkdirSync(dirname(path), { recursive: true });
  }
  return wrap(new DatabaseSync(path));
}

export async function migrate(db) {
  const statements = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      category TEXT NOT NULL,
      client_id TEXT NOT NULL,
      agent_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES users(id),
      FOREIGN KEY (agent_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS ticket_events (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL,
      actor_id TEXT NOT NULL,
      type TEXT NOT NULL,
      payload TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (ticket_id) REFERENCES tickets(id),
      FOREIGN KEY (actor_id) REFERENCES users(id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_tickets_client ON tickets(client_id)`,
    `CREATE INDEX IF NOT EXISTS idx_tickets_agent ON tickets(agent_id)`,
    `CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)`,
    `CREATE INDEX IF NOT EXISTS idx_events_ticket ON ticket_events(ticket_id)`,
    `CREATE INDEX IF NOT EXISTS idx_events_created ON ticket_events(created_at)`,
  ];
  for (const sql of statements) {
    await db.execute(sql);
  }
}

export function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    active: Boolean(row.active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapTicket(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    category: row.category,
    clientId: row.client_id,
    agentId: row.agent_id,
    clientName: row.client_name ?? null,
    agentName: row.agent_name ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
