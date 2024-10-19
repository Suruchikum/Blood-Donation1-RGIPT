const express = require("express");
const router = express.Router();
const User = require("../modals/user.modals");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middleware/authMiddleware");

const {
  handleLogin,
  handleRegister,

  handleLogout,
} = require("../controllers/indexController");

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/logout", handleLogout);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/login", handleLogin);

router.post("/register", handleRegister);

router.use((req, res, next) => {
  next();
});
module.exports = router;
