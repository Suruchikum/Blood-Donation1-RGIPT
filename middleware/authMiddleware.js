const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

const verifyToken = (req, res, next) => {
  const token =
    req.cookies.token ||
    req.query.token ||
    req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  const secretKey = process.env.SECRET_KEY;

  try {
    const verified = jwt.verify(token, secretKey);

    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

module.exports = { verifyToken };
