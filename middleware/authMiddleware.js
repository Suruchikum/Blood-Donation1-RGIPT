const jwt = require("jsonwebtoken");

const User = require("../modals/user.modals");
const Toastify = require("toastify-js"); 

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("token received", token);
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  const secretKey = process.env.SECRET_KEY;

  try {
    const verified = jwt.verify(token, secretKey);cd 
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

module.exports = authMiddleware;
