// src/auth/jwt.ts
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { getUsersCollection } from "./users.js";

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

// Basic refresh token creation and storage (rotate on use)
// export async function createRefreshToken(userId: string) {
//   const tokenId = uuid();
//   const token = jwt.sign({ sub: userId, tid: tokenId }, REFRESH_SECRET, { expiresIn: "30d" });

//   const users = await getUsersCollection();
//   // store token id (or full token hashed) - here we store tokenId array
//   await users.updateOne({ _id: userId }, { $push: { refreshTokens: { id: tokenId, createdAt: new Date() } } });
//   return token;
// }

// export async function rotateRefreshToken(oldToken: string) {
//   try {
//     const payload: any = jwt.verify(oldToken, REFRESH_SECRET);
//     const userId = payload.sub;
//     const tid = payload.tid;
//     const users = await getUsersCollection();
//     const user = await users.findOne({ _id: userId, "refreshTokens.id": tid });
//     if (!user) return null;
//     // remove old token id and create new
//     await users.updateOne({ _id: userId }, { $pull: { refreshTokens: { id: tid } } });
//     const newToken = await createRefreshToken(userId);
//     const access = signAccessToken({ sub: userId });
//     return { accessToken: access, refreshToken: newToken, user };
//   } catch {
//     return null;
//   }
// }
