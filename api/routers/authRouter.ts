import express from "express";
import passport from "passport";
import { initPassport } from "../../src/auth/passport.js";
import { signAccessToken } from "../../src/auth/jwt.js";
import { createLocalUser, verifyLocalUser, findUserById } from "../../src/auth/users.js";
import { getUserIdFromToken } from "../../src/auth/jwt.js";

initPassport();

const router = express.Router();

// --- Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { session: false }), async (req: any, res) => {
  // user is in req.user
  const user = req.user;
  const access = signAccessToken({ sub: user._id });
  res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?access=${access}`);
});

// --- GitHub OAuth
router.get("/github", passport.authenticate("github", {     session: false,
    scope: ["repo", "write:repo_hook", "read:user", "user:email"],
 }));
router.get("/github/callback", passport.authenticate("github", { session: false, }), async (req: any, res) => {
  const user = req.user;
  const github = user.oauth.github.id;
  const access = signAccessToken({ sub: user._id });
  res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?access=${access}&github=${github}`);
});

// --- Local signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    const name = first_name;
    const user = await createLocalUser({ email, password, name });
    const access = signAccessToken({ sub: user._id });
    res.json({ user: { _id: user._id, email: user.email, name: user.name }, access });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- Local login
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await verifyLocalUser({ email, password });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const access = signAccessToken({ sub: user._id });
    res.json({ user: { _id: user._id, email: user.email, name: user.name }, access });
  } catch (err: any) {
    res.status(500).json({ error: "Login failed" });
  }
});


// --- Get current user
router.get("/me", async (req, res) => {
  // accept Authorization header Bearer <token>
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const userId: any = getUserIdFromToken(token);
    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: { _id: user._id, email: user.email, name: user.name, avatar: user.avatar , oauth: user.oauth } });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
