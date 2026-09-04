import { argon2id, argon2Verify } from "hash-wasm";

function randomSalt() {
  return crypto.getRandomValues(new Uint8Array(16));
}

export function hashPassword(plain) {
  return argon2id({
    password: String(plain),
    salt: randomSalt(),
    parallelism: 1,
    iterations: 2,
    memorySize: 19456,
    hashLength: 32,
    outputType: "encoded",
  });
}

export function verifyPassword(hashed, plain) {
  return argon2Verify({
    password: String(plain),
    hash: String(hashed),
  });
}
