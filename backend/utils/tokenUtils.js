import jwt from "jsonwebtoken";

export function createToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export function verifyToken(req, res, next) {
  const token = req.signedCookies?.token; // Read token from the cookie

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.userId = authData.id; // Attach user ID to request
    next();
  });
}

export function decodeToken(token) {
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7); // Remove 'Bearer ' (7 characters)
  }
  return jwt.decode(token);
}
