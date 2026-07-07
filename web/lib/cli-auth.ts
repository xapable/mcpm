// In production, store tokens in DB with expiry
const tokenStore = new Map<string, { userId: string; username: string }>();

export function generateCliToken(): string {
  const crypto = require("crypto");
  return crypto.randomBytes(32).toString("hex");
}

export function storeCliToken(
  token: string,
  data: { userId: string; username: string }
) {
  tokenStore.set(token, data);
}

export function verifyCliToken(
  token: string
): { userId: string; username: string } | null {
  return tokenStore.get(token) || null;
}
