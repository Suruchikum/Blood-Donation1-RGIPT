const dotenv = require("dotenv").config();
const path = require("path");

const session = require('express-session');
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');
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
// const { is } = require("type-is");
// const { register } = require("module");
const staticpath = path.join(__dirname, "../RGIPT Blood Donation");
const app = express();
// establish session

app.use(flash());
app.use(cookieParser('SecretStringForCookies'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(session({
  secret:'SecretStringForSession',
  saveUninitialized: true,
  resave: true,
  cookie:{maxAge:60000}
}));


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
app.use(flash());
app.get("/hello", query("person").notEmpty().escape(), (req, res) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const data = matchedData(req);
    return res.send(`Hello, ${data.person}!`);
  }

  res.status(400).send({ errors: result.array() });
});
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      req.session.errorMessage = 'Oops! There was something wrong with your input!';
      return res.redirect('/login');
  }

  // Login logic...
});

app.get('/', function(req,res){
  res.redirect('/')
});
app.get('/flash', function(req, res){
  
  req.flash('info', 'Flash is back!')
  res.redirect('/');
});
app.get('/', function(req, res){
  const message = req.flash('message')
  res.render('index', { message: message });
});
app.get('/flash', (req, res) => {
  const errorMessage = req.session.errorMessage;
  req.session.errorMessage = null;  // Clear the message after displaying
  res.render('login', { errorMessage });
});

 app.get('/success-flash', function(req, res){
   req.flash('message', ['User added successfully!','success'])
   res.redirect('/donate');
 });

 app.get('/no-flash', function(req, res){
   res.redirect('/login');
 });
 app.get('/error-flash', function(req, res){
  res.redirect('/register');
});
 app.get('/', (req, res) => {
  const message = ['Welcome to the site!', 'success']; // Example message
  res.render('index', { message });
});





app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
