import express from "express";
import passport from "passport";
import { initPassport } from "./passportSetup.js";
import { signAccessToken, createRefreshToken, rotateRefreshToken } from "../../src/auth/jwt.js";
import { createLocalUser, verifyLocalUser, findUserById } from "../../src/auth/users.js";

initPassport();

const router = express.Router();

// --- Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false }), async (req: any, res) => {
  // user is in req.user
  const user = req.user;
  const access = signAccessToken({ sub: user._id });
  const refresh = await createRefreshToken(user._id);
  // in production, set cookie; for now redirect to frontend with tokens (or set cookie)
  res.redirect(`${process.env.FRONTEND_URL}/auth/oauth-callback?access=${access}&refresh=${refresh}`);
});

// --- GitHub OAuth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { session: false }), async (req: any, res) => {
  const user = req.user;
  const access = signAccessToken({ sub: user._id });
  const refresh = await createRefreshToken(user._id);
  res.redirect(`${process.env.FRONTEND_URL}/auth/oauth-callback?access=${access}&refresh=${refresh}`);
});

// --- Local signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const user = await createLocalUser({ email, password, name });
    const access = signAccessToken({ sub: user._id });
    const refresh = await createRefreshToken(user._id);
    res.json({ user: { _id: user._id, email: user.email, name: user.name }, access, refresh });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- Local login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await verifyLocalUser({ email, password });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const access = signAccessToken({ sub: user._id });
    const refresh = await createRefreshToken(user._id);
    res.json({ user: { _id: user._id, email: user.email, name: user.name }, access, refresh });
  } catch (err: any) {
    res.status(500).json({ error: "Login failed" });
  }
});

// --- Refresh token
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  const rotated = await rotateRefreshToken(refreshToken);
  if (!rotated) return res.status(401).json({ error: "Invalid refresh token" });
  res.json(rotated);
});

// --- Get current user
router.get("/me", async (req, res) => {
  // accept Authorization header Bearer <token>
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Missing token" });
  const [, token] = auth.split(" ");
  try {
    const payload: any = (await import("jsonwebtoken")).verify(token, process.env.JWT_SECRET!);
    const user = await findUserById(payload.sub);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: { _id: user._id, email: user.email, name: user.name, avatar: user.avatar } });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
