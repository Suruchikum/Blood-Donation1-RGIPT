const User = require("../modals/user.modals");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

const handleLogin = async function handleLogin(req, res) {
  /* const email = req.body.email
    const password = req.body.password */

  // const {email,password} = req.body
  // console.log(req.body)
  // User.find({ email, password}, function (err, user) {

  //     if (err){
  //         console.log(err);
  //     }
  //     else{
  //         console.log("User is : ", user);
  //         if(user) {
  //             const msg = "Valid user"
  //             return res.status(200).redirect('/donate')
  //         } else {
  //             const msg = "Invalid login"
  //             return res.status(400).redirect('/login')
  //         }
  //     }
  //  });
  // const { email,password} = req.body
  // if (error.code === 11000 && error.keyPattern.email === 1) {
  //   // Display error message to user
  //   console.log("Email already in use");
  // } else {
  //   // Handle other errors
  //   console.log("error");
  // }
  // // console.log(req.body)
  // try {
  //   const user=   await User.create(req.body)
  //   if(user) {
  //     return res.status(200).redirect('/donate')
  //   } else {
  //     return res.status(400).redirect('/login')
  //   }
  // } catch(err) {
  //     console.log('Error in login',err)
  // }
  // module.exports ={handleRegister};
  try {
    const { email, password } = req.body;
    // const token = await user.generateAuthToken();
    // Pehle check karein ki email already exist karta hai ya nahi
    const existingUser = await User.findOne({ email });
    console.log("User exist", existingUser);

    if (existingUser) {
      // Agar email already exist karta hai
      const match = await bcrypt.compare(password, existingUser.password);
      // token = await existingUser.generateAuthToken();
      // console.log(token);
      // //

      if (match) {
        const token = jwt.sign({ existingUserId: existingUser._id }, secret, {
          expiresIn: "1h",
        });

        return res.status(200).redirect(`/donate?token=${token}`);
      } else {
        return res.status(401).redirect("/login");
      }
    }
    return res.status(401).json({ message: "User not found" });
  } catch (err) {
    // Agar koi aur error hota hai to handle karein
    // if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
    //   res.status(409).send('Duplicate key error: Email already exists');
    //  else {
    //     res.status(500).send(err.message);
    //  }

    // return res.status(401).redirect('/help')
    console.log(err);
  }
  // function setUser(user){
  //   return jwt.sign(user,secret);

  //   }
  //   function getgUser(token){
  //     return jwt.verify(token,secret);
  //   }
};
const handleLogout = async function handleLogout(req, res) {
  const token = jwt.sign({existingUserId:null

  }, secret, {
    expiresIn: "-1",
  });
  return res.status(200).redirect(`/login?token=${token}`);


};
const handleRegister = async function handleRegister(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({ error: "plz filled the properly" });
  }

  // console.log(req.body)
  // try {
  //   const user=   await User.create(req.body)
  //   if(user) {
  //     return res.status(200).redirect('/login')
  //   } else {
  //     return res.status(400).redirect('/register')
  //   }
  //   const salt = await bcrypt.genSalt(10)
  //   const hashedPassword=await bcrypt.hash(req.body.password,salt)
  //   req.body.password=hashedPasseord
  //   const user1 =new user1model(req.body)
  //   await user1.save()

  //   return res.status(201).send({
  //     success:true,
  //     message:"User Registerd Successfully",
  //   })
  // } catch(err) {
  //     console.log('Error in registeration',err)
  // }
  // module.exports ={handleRegister};
  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already Exist" });
    }

    const user = new User({ name: name, email: email, password: password });
    await user.save();

    res.status(201).json({ message: "user registered successfuly" });
  } catch (err) {
    console.log(err);
  }
};
const handleHelp = async function handleHelp(req, res) {
  const { name, email, phone, massage } = req.body;

  // let isValidUser=true
  // if(isValidUser) {
  //     const msg = "Valid user"
  //     return res.status(200).redirect('/index')
  // } else {
  //     const msg = "Invalid login"
  //     return res.status(400).redirect('/help')
  // }

  // console.log(req.body)
  try {
    const user = await User.create(req.body);
    if (user) {
      return res.status(200).redirect("/register");
    } else {
      return res.status(400).redirect("/help");
    }
  } catch (err) {
    console.log("Error in help", err);
  }
};

module.exports = { handleLogin, handleRegister, handleHelp,handleLogout };
