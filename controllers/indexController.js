const User = require("../modals/user.modals");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const nodemailer = require("nodemailer");

// const sendMail = async (req, res) => {
//   let testAccount = await nodemailer.createTestAccount();

//   let transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false,
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass,
//     },
//   });

//   let info = await transporter.sendMail({
//     from: '"Suruchi Kumari 👻" <suruchikumari1964@gmail.com>',
//     to: "22it3056@rgipt.ac.in",
//     subject: "Hello ✔",
//     text: "Hello world?",
//     html: "<b>Hello world?</b>",
//   });

//   console.log("Message sent: %s", info.messageId);
//   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   res.json({ message: "Email sent successfully", info });
// };

const sendMail = async (req, res) => {
  // Manually fixed Ethereal account details yaha daalein
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "hipolito.hyatt82@ethereal.email",
      pass: "XQSReMVTRaW5rvf4yG",
    },
  });

  let info = await transporter.sendMail({
    from: '"Suruchi Kumari 👻" <suruchikumari1964@gmail.com>',
    to: "22it3056@rgipt.ac.in",
    subject: "Hello ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>",
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  res.json({ message: "Email sent successfully", info });
};
const handleLogin = async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    // const token = await user.generateAuthToken();

    const existingUser = await User.findOne({ email: req.body.email });
    console.log("User exist", existingUser);

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

        return res.status(200).redirect(`/donate`);
      } else {
        req.flash("error", "Invalid password!");
        return res.status(401).redirect("/login");
      }
    }
    req.flash("error", "User not found!");
    res.status(401).json({ message: "User not found" });
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
  const { name, email, password, age, gender, phone, bloodType } = req.body;
  if (!name || !email || !password || !age || !gender || !phone || !bloodType) {
    return res.status(422).json({ error: "plz fill all the fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      req.flash("error", "Email already Exist");
      return res.status(422).json({ error: "Email already Exist" });
    }

    const user = new User({
      name: name,
      email: email,
      password: password,
      dob: dob,
      gender: gender,
      phone: phone,
      bloodType: bloodType,
    });
    console.log("Gender:", req.body.gender);
    await user.save();
    req.flash("success", "User registered successfully");
    res.status(201).json({ message: "user registered successfuly" });
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

module.exports = {
  handleLogin,
  handleRegister,
  handleLogout,
  someControllerFunction,
  sendMail,
};
