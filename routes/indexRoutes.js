const express = require("express");
const router = express.Router();
const User = require("../modals/user.modals");
const jwt = require("jsonwebtoken");

const { someControllerFunction } = require('../controllers/indexController');
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
router.post("/register", (req, res) => {
  const { name, email, password, confirmpassword } = req.body;
  let errors = [];

  if (!name || !email || !password || !confirmpassword)
      errors.push({ message: "Please fill in all fields!" });

  if (password !== confirmpassword)
      errors.push({ message: "Passwords do not match!" });

  if (password.length < 6)
      errors.push({ message: "Password should be at least 6 characters long!" });

  if (errors.length > 0) {
      res.render("register", { errors, name, email });
  } else {
      User.findOne({ email: email })
          .then(user => {
              if (user) {
                  errors.push({ message: "A user with this email address already exists!" });
                  res.render("register", { errors, name, email });
              } else {
                  const newUser = new User({
                      name,
                      email,
                      password
                  });

                  bcrypt.genSalt(10, (error, salt) => {
                      if (error) throw error;

                      bcrypt.hash(newUser.password, salt, (error, hash) => {
                          if (error) throw error;

                          newUser.password = hash;
                          newUser.save()
                              .then(user => {
                                  req.flash("success_message", "You have successfully registered!");
                                  res.redirect("/login");
                              })
                              .catch(error => console.log(error));
                      });
                  });
              }
          });
  }
});

router.post('/donate', someControllerFunction);
// Exporting the controller function

  
module.exports = router;
