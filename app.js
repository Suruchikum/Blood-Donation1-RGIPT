const dotenv = require("dotenv").config();
const path = require("path");
const nodemailer = require("nodemailer");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const { query, matchedData, validationResult } = require("express-validator");

const express = require("express");
const bodyParser = require("body-parser");
const sendMail = require("./controllers/indexController").sendMail;
const mongoose = require("mongoose");
const User = require("./modals/user.modals");
const authMiddleware = require("./middleware/authMiddleware");

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
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(express.static(path.join(__dirname, "./public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/", indexRoutes);

app.get("/donate", authMiddleware, (req, res) => {
  res.render("donate");
});
app.get("/mail", sendMail);

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
