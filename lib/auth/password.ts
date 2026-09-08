import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "crypto";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
