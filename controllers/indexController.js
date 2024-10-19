const User = require("../modals/user.modals");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const handleLogin = async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: req.body.email });
    console.log("User exist", existingUser);

    if (existingUser) {
      const match = await bcrypt.compare(password, existingUser.password);

      if (match) {
        const token = jwt.sign({ existingUserId: existingUser._id }, secret, {
          expiresIn: "1h",
        });

        // return res.status(200).redirect(`/donate?token=${token}`);
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).redirect(`/donate`);
      } else {
        return res.status(401).redirect("/login");
      }
    }
    return res.status(401).json({ message: "User not found" });
  } catch (err) {
    console.log(err);
  }
};
const handleLogout = async function handleLogout(req, res) {
  res.clearCookie("jwt");

  return res.redirect("/");
};

const handleRegister = async function handleRegister(req, res) {
  const {
    name,
    email,
    password,
    age,
    gender,
    phone,
    bloodType,
    confirmPassword,
  } = req.body;
  if (
    !name ||
    !email ||
    !password ||
    !age ||
    !gender ||
    !phone ||
    !bloodType ||
    !confirmPassword
  ) {
    return res.status(422).json({ error: "plz fill all the fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    }
    // ism confirmPassword send nahi kia hai isily error . wiase db me only password save hota hai. confirm password same hota hai
    const user = new User({
      name: name,
      email: email,
      password: password,
      age: age,
      gender: gender,
      phone: phone,
      bloodType: bloodType,
    });
    console.log("Gender:", req.body.gender);
    await user.save();

    res.status(201).json({ message: "user registered successfuly" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { handleLogin, handleRegister, handleLogout };
