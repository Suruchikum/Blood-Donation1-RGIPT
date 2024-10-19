const dotenv = require("dotenv").config();
const path = require("path");

const cookieParser = require("cookie-parser");
const { query, matchedData, validationResult } = require("express-validator");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./modals/user.modals");
const authMiddleware = require("./middleware/authMiddleware");

const DB = process.env.DATABASE;
const PORT = process.env.PORT || 4500;

mongoose.connect(DB);

const indexRoutes = require("./routes/indexRoutes");
const { is } = require("type-is");
const { register } = require("module");

const app = express();
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const staticpath = path.join(__dirname, "../RGIPT Blood Donation");
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

app.use(express.json());
app.get("/hello", query("person").notEmpty().escape(), (req, res) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const data = matchedData(req);
    return res.send(`Hello, ${data.person}!`);
  }

  res.status(400).send({ errors: result.array() });
});

app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
