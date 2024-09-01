const dotenv = require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const User=require("./modals/user.modals");
const DB = process.env.DATABASE;
const PORT = process.env.PORT || 4500;


mongoose.connect(DB); 
// 
// Ensure this file exists and is correctly set up
// const testRoutes = require("./routes/testRoutes");

const indexRoutes = require('./routes/indexRoutes');
const {verifyToken} = require('./middleware/authMiddleware');
// const helpRoutes = require("./routes/helpRoutes");
// const { connect } = require("http2");
const app = express();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Root route
// console.log(path.join(_dirname, "../BLOOD DONAR"));
const staticpath = path.join(__dirname, "../RGIPT Blood Donation");
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static(path.resolve("./public")));

// console.log(staticpath);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



//  app.use("/api/helpRoutes" , helpRoutes );


app.get("/", (req, res) => {
  res.render("index");
});
app.get("/index", (req, res) => {
  res.render("index");
});


app.get("/help", (req, res) => {
  res.render("help");
});

app.get("/donate", verifyToken,(req, res) => {
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
app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
// app.listen(5500,()=>{
//     console.log("listing the port at 5500");
// });