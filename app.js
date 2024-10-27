const dotenv = require("dotenv").config();
const path = require("path");
const nodemailer = require("nodemailer");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const { query, matchedData, validationResult } = require("express-validator");
const { verifyToken } = require("./middleware/authMiddleware");
const { query, matchedData, validationResult } = require("express-validator");

const express = require("express");
const bodyParser = require("body-parser");
const sendMail = require("./controllers/indexController").sendMail;
const mongoose = require("mongoose");
const User = require("./modals/user.modals");
const authMiddleware = require("./middleware/authMiddleware");

const session = require("express-session");
const flash = require("connect-flash");
const DB = process.env.DATABASE;
const PORT = process.env.PORT || 4500;

mongoose.connect(DB);

const indexRoutes = require("./routes/indexRoutes");

const staticpath = path.join(__dirname, "../RGIPT Blood Donation");
const app = express();

// establish session

app.use(flash());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// establish session
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: true,
  })
);
// Configure flash middleware
app.use(flash());
app.use(flashMessageMiddleware.flashMessage);
// bootstrap
app.use("/", express.static("./node_modules/bootstrap/dist/"));

app.use(express.static(path.join(__dirname, "./public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/index", (req, res) => {
  res.render("index");
});

// app.get("/help", (req, res) => {
//   res.render("help");
// });

app.get("/donate", verifyToken, (req, res) => {
  res.render("donate", { token: req.query.token });
});

app.use("/", indexRoutes);
// app.get("/about", (req, res) => {
//   res.status(200).json({
//     message: " Hello About Welcome to Blood Donar",
//   });
//   // res.send("Welcome to about page ")
// });
// app.get("/volunteer", (req, res) => {
//   res.status(200).json({
//     message: " Hello Volunteer Welcome to Blood Donor",
//   });
//   // res.send(" Welcome to Volunteers  page")
// });
// app.get("/donate", (req, res) => {
//   res.status(304).json({
//     message: " Hello Donate Welcome to Blood Donor",
//     // res.send({
//     //     id:2,
//     //     name:"suruchi",
//   });

// });
// res.send(" Welcome to donate page")
// });
// });

// app.get("/help", (req, res) => {
//   res.status(200).json({
//     message: " Hello Help Welcome to Blood Donor",
//     // });
//     // res.send(" Welcome to help page")
//   });
// });
// app.get("*",(req,res)=>{
//   res.send("404 error page")
// });

// const PORT = 5500;

app.use(express.json());
app.use(flash());
app.get("/hello", query("person").notEmpty().escape(), (req, res) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const data = matchedData(req);
    return res.send(`Hello, ${data.person}!`);
  }

  res.status(400).send({ errors: result.array() });
});

app.get("/", function (req, res) {
  res.redirect("/");
});
app.get("/flash", function (req, res) {
  req.flash("info", "Flash is back!");
  res.redirect("/");
});
app.get("/", function (req, res) {
  const message = req.flash("message");
  res.render("index", { message: message });
});
app.get("/", (req, res) => {
  req.flash("message", "Success!!");
  res.redirect("/donate");
});

app.get("/donate", (req, res) => {
  const successMessage = req.flash("success"); // Flash message retrieve karo
  res.render("index", { successMessage }); // EJS template ko successMessage ke saath render karo
});

app.get("/success-flash", function (req, res) {
  req.flash("message", ["User added successfully!", "success"]);
  res.redirect("/");
});
app.get("/no-flash", function (req, res) {
  res.redirect("/login");
});
app.get("/error-flash", function (req, res) {
  res.redirect("/register");
});
app.get("/", (req, res) => {
  const message = ["Welcome to the site!", "success"]; // Example message
  res.render("index", { message });
});

app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
