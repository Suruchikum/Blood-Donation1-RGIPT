const express = require("express");
const router = express.Router();
const User = require("../modals/user.modals");
const jwt = require("jsonwebtoken");

const {
  handleLogin,
  handleRegister,
  handleHelp,
  handleLogout,
} = require("../controllers/indexController");

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/logout" , handleLogout);

router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/help", (req, res) => {
  res.render("help");
});

router.post("/login", handleLogin);
// router.post("/logout" , handleLogout);
router.post("/register", handleRegister);

// router.post("/help", handleHelp);

module.exports = router;
