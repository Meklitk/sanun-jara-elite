import jwt from "jsonwebtoken";

export function signAdminToken({ adminId }, jwtSecret) {
  return jwt.sign({ sub: adminId, type: "admin" }, jwtSecret, { expiresIn: "7d" });
}

export function requireAdmin(jwtSecret) {
  return function requireAdminMiddleware(req, res, next) {
    const auth = req.headers.authorization || "";
    const [scheme, token] = auth.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "missing_token" });
    }
    try {
      const payload = jwt.verify(token, jwtSecret);
      if (!payload || payload.type !== "admin") {
        return res.status(401).json({ error: "invalid_token" });
      }
      req.admin = { id: payload.sub };
      return next();
    } catch {
      return res.status(401).json({ error: "invalid_token" });
    }
  };
}

