export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


// authentication middleware
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export function requireAuth(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const [, token] = auth.split(" ");
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = { id: payload.sub };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
