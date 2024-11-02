const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token =
    req.cookies.jwt ||
    req.query.token ||
    req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  try {
    const verified = jwt.verify(token, secret);

    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

module.exports = { verifyToken };
