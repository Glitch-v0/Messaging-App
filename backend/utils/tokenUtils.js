import jwt from "jsonwebtoken";

export function createToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

export function verifyToken(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, authData) => {
      if (err) {
        return res.sendStatus(401);
      }
      if (req.params.userId !== authData.id) {
        return res.sendStatus(403);
      }
      req.user = authData.id;
      next();
    });
  } else {
    return res.sendStatus(401);
  }
}

export function decodeToken(token) {
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7); // Remove 'Bearer ' (7 characters)
  }
  return jwt.decode(token);
}
