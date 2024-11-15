const User = require("../modals/user.modals");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const { sendMail } = require("../config/gmail");
const formatDate = require("../util/dateFormat");
// const { getDonors } = require("../util/dateFormat");

const handleLogin = async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    // const token = await user.generateAuthToken();

    const existingUser = await User.findOne({ email });
    console.log("User exist", existingUser, email);

    if (existingUser) {
      const match = await bcrypt.compare(password, existingUser.password);

      if (match) {
        const token = jwt.sign({ existingUserId: existingUser._id }, secret, {
          expiresIn: "1h",
        });
        req.flash("success", "Login Success!");
        // return res.status(200).redirect(`/donate?token=${token}`);
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        // Send mail to user
        const subject = "Welcome Back!";
        const message = `Thank you for logging into ${process.env.APPNAME} website.!`;
        const recipient = email;

        const mailResult = await sendMail(subject, message, recipient);
        if (mailResult.success) {
          console.log("Email sent successfully");
        } else {
          console.log("Failed to send email:", mailResult.message);
        }

        return res.status(200).redirect(`/donate`);
      } else {
        req.flash("error", "Invalid password!");
        return res.status(401).redirect("/login");
      }
    } else {
      req.flash("error", "User not found!");
      return res.status(401).redirect("/login");
    }
  } catch (err) {
    console.log(err);
    req.flash("error", err.message);
    return res.status(401).redirect("/login");
  }
};
const handleLogout = async function handleLogout(req, res) {
  res.clearCookie("jwt");

  return res.redirect("/");
};

const handleRegister = async function handleRegister(req, res) {
  // bloodgroup optional as user may not know bloodgroup at register time

  const { name, email, password, dob, gender, phone } = req.body;

  if (!name || !email || !password || !dob || !gender || !phone) {
    return res.status(422).json({ error: "plz fill all the fields" });
  }

  // validate password
  // const regex = new RegExp(
  //   "^(?=.[A-Za-z])(?=.d)(?=.[@$!%#?&])[A-Za-zd@$!%*#?&]{8,}$"
  // );
  // const isValidPassword = regex.test(password);
  // console.log("password is ", isValidPassword);

  // if (isValidPassword) {
  //   req.flash("error", "Please enter valid passowrd");
  //   return res.status(422).json({ error: "Please enter valid password" });
  // }
  // Password validation
  const passwordRegex = new RegExp(
    "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$"
  );
  const isValidPassword = passwordRegex.test(password);
  console.log("Password is valid:", isValidPassword);

  if (!isValidPassword) {
    // Check for invalid password
    req.flash("error", "Please enter a valid password");
    return res.status(422).json({ error: "Please enter a valid password" });
  }

  // Phone number validation
  const phoneNumberRegex = new RegExp("^[1-9][0-9]{9}$");
  const isValidPhoneNumber = phoneNumberRegex.test(phone);

  console.log("Phone number is valid:", isValidPhoneNumber);

  if (!isValidPhoneNumber) {
    req.flash("error", "Please enter a valid phone number");
    return res.status(422).json({ error: "Please enter a valid phone number" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      req.flash("error", "Email already Exist");
      return res.status(422).json({ error: "Email already Exist" });
    }
    const userData = { name, email, password, dob, gender, phone };
    if (req.body.bloodGroup) {
      userData.bloodGroup = req.body.bloodGroup;
    }
    const user = new User(userData);
    console.log("Gender:", req.body.gender);
    await user.save();
    req.flash("success", "User registered successfully");
    // res.status(201).json({ message: "user registered successfuly" });
    res.redirect("/");
  } catch (err) {
    req.flash("error", err.message);
    console.log(err);
  }
};

const someControllerFunction = (req, res) => {
  const success = true; // Example logic

  if (success) {
    res.redirect("/donate");
  } else {
    res.render("form", {
      messages: { error_message: "There was an error submitting the form." },
    });
  }
};

const displayDonors = async (req, res) => {
  try {
    const donors = await User.find({ status: "active" }).select([
      "name",
      "phone",
      "bloodGroup",
      "dob",
    ]);
    const data = [];
    donors.map((donor) => {
      const { name, phone, bloodGroup, dob } = donor;
      data.push({ name, phone, bloodGroup, dob: formatDate(dob) });
    });

    return res.render("donors", { donors: data });
  } catch (err) {
    req.flash("error", err.message);
    console.log(err);
  }
};
// controllers/donorController.js

const getDonors = (req, res) => {
  try {
    // Sample data or data fetched from a database
    const data = [];
    const donors = us̥ers.map((users) => {
      const { name, phone, bloodGroup, dob } = user;
      data.push({ name, phone, bloodGroup, dob: formatDate(dob) });
    });

    // Render the view with formatted donor data
    res.render("donors", { donors });
  } catch (error) {
    console.error("Error formatting date:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  handleLogin,
  handleRegister,
  handleLogout,
  someControllerFunction,
  sendMail,
  displayDonors,
  getDonors,
};
