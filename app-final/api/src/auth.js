import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();

function secret() {
  return encoder.encode(
    process.env.JWT_SECRET || "aether-desk-demo-jwt-nao-usar-em-producao-real"
  );
}

export function signToken(user) {
  return new SignJWT({
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret());
}

export async function readToken(token) {
  const { payload } = await jwtVerify(token, secret());
  return payload;
}
