const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { number } = require("assert-plus");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // dob: {
    //   type: Date,
    //   required: [true, 'Date of Birth is required'],
    // },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
      
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    phone: {
      type: Number,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],

    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  try {
    console.log(this._id);
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token });

    await this.save();
    return token;
  } catch (error) {
    resizeBy.send("the error part" + error);
    console.log("the error part" + error);
  }
};
userSchema.pre("save", async function (next) {
  const saltRounds = 10;
  if (this.isModified("password") || this.isNew) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword;
      next();
    } catch (err) {
      next(new Error("Encryption error: " + err.message));
    }
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
