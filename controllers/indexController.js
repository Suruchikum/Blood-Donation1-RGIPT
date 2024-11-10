const User = require("../modals/user.modals");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const { transporter, mailOptions } = require("../config/gmail");

const sendMail = async (subject, message, recepient) => {
  let emailOptions = mailOptions;
  emailOptions.subject = subject;
  emailOptions.text = message;
  emailOptions.to = recepient;
  transporter.sendMail(emailOptions, function (err, data) {
    if (err) {
      console.log(err);
      return { success: false, message: err };
    } else {
      console.log(`Mail sent to ${data.accepted}`);
      return { success: true, message: data };
    }
  });
};
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
        const mailMessage = `${email} has sucessfully accessed to ${process.env.APPNAME} website.`;
        /*
        TODO : send mail via API key or autorefresh token
       */
        await sendMail(
          `${process.env.APPNAME}: LOGIN Access`,
          mailMessage,
          email
        );

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
  const { name, email, password, age, gender, phone } = req.body;
  if (!name || !email || !password || !age || !gender || !phone) {
    return res.status(422).json({ error: "plz fill all the fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      req.flash("error", "Email already Exist");
      return res.status(422).json({ error: "Email already Exist" });
    }
    const userData = { name, email, password, age, gender, phone };
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

module.exports = {
  handleLogin,
  handleRegister,
  handleLogout,
  someControllerFunction,
  sendMail,
};
