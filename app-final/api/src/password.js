import { pbkdf2, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const pbkdf2Async = promisify(pbkdf2);
const ROUNDS = 10000;
const KEYLEN = 32;

export async function hashPassword(plain) {
  const salt = randomBytes(16);
  const hash = await pbkdf2Async(String(plain), salt, ROUNDS, KEYLEN, "sha256");
  return `pbkdf2$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(stored, plain) {
  const parts = String(stored).split("$");
  if (parts.length !== 3 || parts[0] !== "pbkdf2") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  if (expected.length !== KEYLEN) return false;
  const actual = await pbkdf2Async(String(plain), salt, ROUNDS, KEYLEN, "sha256");
  return timingSafeEqual(expected, actual);
}
