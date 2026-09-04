import { COMPANY } from "./company.js";
import { createDb, migrate } from "./db.js";
import { hashPassword } from "./password.js";
import { nowIso } from "./http.js";

export const DEMO_USERS = [
  {
    id: "usr_admin",
    name: "Marina Alves",
    email: "admin@aether.desk",
    password: "Admin#123",
    role: "admin",
  },
  {
    id: "usr_agente",
    name: "Caio Ferreira",
    email: "agente@aether.desk",
    password: "Agente#123",
    role: "atendente",
  },
  {
    id: "usr_cliente",
    name: "Helena Costa",
    email: "cliente@aether.desk",
    password: "Cliente#123",
    role: "cliente",
  },
];

export async function seedUsers(db) {
  const stamp = nowIso();
  for (const user of DEMO_USERS) {
    const passwordHash = await hashPassword(user.password);
    await db.execute({
      sql: `INSERT INTO users (id, name, email, password_hash, role, active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 1, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
              name = excluded.name,
              password_hash = excluded.password_hash,
              role = excluded.role,
              active = 1,
              updated_at = excluded.updated_at`,
      args: [user.id, user.name, user.email, passwordHash, user.role, stamp, stamp],
    });
  }
}

export async function seedIfEmpty(db) {
  const result = await db.execute("SELECT COUNT(*) AS n FROM users");
  const n = Number(result.rows[0]?.n ?? 0);
  if (n === 0) await seedUsers(db);
}

const runningCli = process.argv[1]?.endsWith("seed.js");
if (runningCli) {
  const db = createDb();
  await migrate(db);
  await seedUsers(db);
  console.log(`Seed ok — ${COMPANY.nomeFantasia}`);
  console.log("admin@aether.desk / Admin#123");
  console.log("agente@aether.desk / Agente#123");
  console.log("cliente@aether.desk / Cliente#123");
}
