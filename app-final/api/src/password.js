import { Algorithm, hash, verify } from "@node-rs/argon2";

const OPTIONS = {
  algorithm: Algorithm.Argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
};

export function hashPassword(plain) {
  return hash(plain, OPTIONS);
}

export function verifyPassword(hashed, plain) {
  return verify(hashed, plain, OPTIONS);
}
