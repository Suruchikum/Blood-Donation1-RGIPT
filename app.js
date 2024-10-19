// const dotenv = require("dotenv").config();
// const path = require("path");
// const express = require("express");
// const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const { query, matchedData, validationResult } = require("express-validator");

// const authMiddleware = require("../middleware/authMiddleware"); // Corrected path
// const User = require("./models/user.model"); // Corrected path

// const DB = process.env.DATABASE;
// const PORT = process.env.PORT || 4500;

// // MongoDB connection
// mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));

// // Initialize express app
// const app = express();

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(express.json()); // Body parser for JSON requests

// // Static path for serving public files
// app.use(express.static(path.join(__dirname, "./public")));

// // Setting up view engine as EJS
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // Root routes
// app.get("/", (req, res) => {
//   res.render("index");
// });
// app.get("/index", (req, res) => {
//   res.render("index");
// });
// app.get("/blood-group-count", (req, res) => {
//   res.render("blood-group-count");
// });
// app.get("/dashboard", (req, res) => {
//   res.render("dashboard");
// });
// app.get("/donate", authMiddleware, (req, res) => {
//   res.render("donate");
// });

// // User registration route
// app.post("/register", async (req, res) => {
//   try {
//     const { name, email, gender, phone, age, bloodType, password, confirmpassword } = req.body;

//     if (password === confirmpassword) {
//       const registerStudent = new User({
//         name,
//         email,
//         gender,
//         phone,
//         age,
//         bloodType,
//         password
//       });

//       // Generate auth token
//       const token = await registerStudent.generateAuthToken();
//       console.log("Token: " + token);

//       // Set cookie with the JWT token
//       res.cookie("jwt", token, {
//         expires: new Date(Date.now() + 30000),
//         httpOnly: true
//       });

//       // Save registered user
//       const registered = await registerStudent.save();
//       res.status(201).render("index");
//     } else {
//       res.send("Passwords do not match");
//     }
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// // Sample validation route
// app.get("/hello", query("person").notEmpty().escape(), (req, res) => {
//   const result = validationResult(req);
//   if (result.isEmpty()) {
//     const data = matchedData(req);
//     return res.send(`Hello, ${data.person}!`);
//   }
//   res.send({ errors: result.array() });
// });

// // Start server
// app.listen(PORT, () => {
//   console.log("Server is running at port", PORT);
// });
const dotenv = require("dotenv").config();
const path = require("path");
// const https = require('https');
// const fs = require('fs');

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
//
// Ensure this file exists and is correctly set up
// const testRoutes = require("./routes/testRoutes");

const indexRoutes = require("./routes/indexRoutes");
const { is } = require("type-is");
const { register } = require("module");
// const {verifyToken} = require('./middleware/authMiddleware');
// const helpRoutes = require("./routes/helpRoutes");
// const { connect } = require("http2");
const app = express();
app.use(cookieParser());

// app.js
// const form = document.getElementById('dataForm');

// form.addEventListener('submit', (event) => {
//     event.preventDefault();

//     const formData = {
//         name: document.getElementById('name').value,
//         age: document.getElementById('age').value,
//         city: document.getElementById('city').value
//     };

//     fetch('http://localhost:4500/submit', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//     })
//     .then(response => response.text())
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));
// });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// app.use(authMiddleware);

// Root route
// console.log(path.join(_dirname, "../BLOOD DONAR"));
const staticpath = path.join(__dirname, "../RGIPT Blood Donation");
app.use(express.static(path.join(__dirname, "./public")));
// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };

// console.log(staticpath);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//  app.use("/api/helpRoutes" , helpRoutes );

 app.get("/", (req, res) => {
  res.render("index");
});
/*
app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/register", (req, res) => {
  res.send("register");
});
app.get("/blood-group-count", (req, res) => {
  res.render("blood-group-count");
});
app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});
 */
// app.get("/help", (req, res) => {
//   res.render("help");
// });
app.use("/", indexRoutes);
app.get("/donate", authMiddleware, (req, res) => {
  res.render("donate");
});
// app.post("/register", async (req, res) => {
  //   try {
  //     const password = req.body.password;
  //     const cpassword = req.body.confirmpassword;
  //     if (password == cpassword) {
  //       const user = new User ({
  //         name: req.body.name,
  //         email: req.body.email,
  //         gender: req.body.gender,
  //         phone: req.body.phone,
  //         age: req.age,
  //         bloodType: req.bloodType,
  //         password: password,
  //         confirmpassword: cpassword,
  //       });
  //       const token = await user.generateAuthToken();
  //       console.log("the token part" + token);
  //       res.cookie("jwt", token, {
  //         expires: new Date(Date.now() + 30000),
  //         httpOnly: true,
  //       });
  //       console.log(cookie);

  //       const registered = await user.save();
  //       res.status(201).render("index");
  //     } else {
  //       res.send("password are not matching");
  //     }
  //     // Example: Save user data to the database
  //   } catch (error) {
  //     res.status(400).send(error);
  //   }
  // });
  // try {
  //   const { password, confirmpassword, name, email, gender, phone, age, bloodType } = req.body;

  //   if (password === confirmpassword) {
  //     const user = new User({
  //       name,
  //       email,
  //       gender,
  //       phone,
  //       age,
  //       bloodType,
  //       password,
  //     });

  //     const token = await user.generateAuthToken();
  //     res.cookie("jwt", token, {
  //       expires: new Date(Date.now() + 30000),
  //       httpOnly: true,
  //     });

  //     await user.save();
  //     res.status(201).render("index");
  //   } else {
  //     res.send("Passwords do not match.");
  //   }
  // } catch (error) {
  //   res.status(400).send(error);
  // }
  // });
  // try {
  //   const password = req.body.password;
  //   const confirmpassword = req.body.confirmpassword;
    // if (password === confirmpassword) {
    //   const registerEmployee = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     gender: req.body.gender,
    //     phone: req.body.phone,
    //     age: req.body.age,
    //     password: req.body.password,
    //     confirmpassword: req.body.confirmpassword,
    //   });
    //   console.log("the success part" + registerEmployee);
    //   const token = await registerEmployee.generateAuthToken();
    //   console.timeLog("the token" + token);
    //   res.cookie("jwt", token, {
    //     expires: new Date(Date.now() + 30000),
    //     httpOnly: true,
    //   });
    //   console.log(cookie);
    //   const registered = await registerEmployee.save();
    //   res.status(201).render("index");
    // } else {
      // res.send("password are not matching");
    // }
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// Example of a route using Express Validator

// Exclude favicon route from auth
// app.get("/favicon.ico", (req, res) => res.status(204));

//  app.post("/register , async (req,res") =>{

//     const password = req.body.password;
//     const cpassword = req.body.confirmpassword;
//     if(password==cpassword){

//     }
//   })
//     const email = req.body.email;
//     const password = req.body.password;
//     const useremail = await registerables.findOne({email:email});
//     const isMatch = await bcrypt.compare(password,useremail.password);
//     const token = await useremail.generateAuthToken();
//     console.log("the token part"+ token);
//     res.cookie("jwt" , token,{
//       expires:new Date(Date.now() + 600000),
//       httpOnly:true,
//       try {
//         const email = req.body.email;
//         const password = req.body.password;

//       }
//     })
//   }
//  });
// app.post("/login", async (req, res) => {
//   try {
//     const email = req.body.email;
//     const password = req.body.password;
//     const useremail = await User.findOne({ email: email });
//     const isMatch = bcrypt.compare(password, useremail.password);
//     const token = await registerEmployee.generateAuthToken();
//     console.log("the token part" + token);
//     res.cookie("jwt", token, {
//       expires: new Date(Date.now() + 30000),
//       httpOnly: true,
//     });

//     if (isMatch) {
//       res.status(201).render("index");
//     } else {
//       res.send("invalid login  details");
//     }
//   } catch (error) {
//     res.status(400).send("invald Email");
//   }
// });


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
app.get("/hello", query("person").notEmpty().escape(), (req, res) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    const data = matchedData(req);
    return res.send(`Hello, ${data.person}!`); // Use backticks for template literals
  }

  res.status(400).send({ errors: result.array() }); // Return errors if validation fails
});

app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
// https.createServer(options, app).listen(4500, () => {
//   console.log('Server is running on https://localhost:4500');
// });
// app.listen(5500,()=>{
//     console.log("listing the port at 5500");
// });
