import { argon2id, argon2Verify } from "hash-wasm";

const OPTIONS = {
  parallelism: 1,
  iterations: 1,
  memorySize: 8,
  hashLength: 32,
  outputType: "encoded",
};

function randomSalt() {
  return crypto.getRandomValues(new Uint8Array(16));
}

export function hashPassword(plain) {
  return argon2id({
    ...OPTIONS,
    password: String(plain),
    salt: randomSalt(),
  });
}

export function verifyPassword(hashed, plain) {
  return argon2Verify({
    password: String(plain),
    hash: String(hashed),
  });
}
