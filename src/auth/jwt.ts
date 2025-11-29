// src/auth/jwt.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "365d"; // 1 year

export function signAccessToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getUserIdFromToken(token: string): Promise<string | null> {
  if (!token){ 
    console.log("Missing token");
    return null;
  }
  console.log(token);
  const payload: any = jwt.verify(token, JWT_SECRET);
  const userid = payload.sub;

  const userId = userid.toString();
  return userId;
}
