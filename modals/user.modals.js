// const mongoose = require('mongoose');
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// // const saltRounds = process.env.SALT_ROUNDS ||10;

// const userSchema = new mongoose.Schema({
//     name: {
//         type:String,
//         required:true
        
//         },
    
//     role:{
//          type:String,
//          default:"user"
//      },
//     email: {
//         type:String,
//         required:[true,"email is required"],
//         unique:true
//     },
//     password:{
//         type:String,
//         required:[true,"password is required"]
//     },
//     age: {
//         type: Number, // Age should be a number
//         required: true, // Age is required
//         min: 0 // Age should not be negative
//     },
//     gender: {
//         type: String, // Gender should be a string
//         enum: ['Male', 'Female', 'Other'], // Allow only specific values for gender
//         required: true // Gender is required
//     },
//     phone: {
//         type: String, // Phone number is stored as a string
//         required: true, // Phone number is required
//         unique: true, // Ensure phone number is unique
//         match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'] // Validate phone number format
//     },
//     bloodType: {
//         type: String, // Blood type should be a string
//         enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // Allow only specific blood types
//         required: true // Blood type is required
//     }
//     // tokens:[
//     //     {
//     //         token:{
//     //             type:String,
//     //             required:true
//     //         }
//     //     }
//     // ],
    
//     status: {
//         type:String,
//         default:"active"
//     },
// },{timestamps: true});


// // userSchema.pre("save",async function(next){
    
// //       if(this.isModified("password")){
// //        const hashedPassword = await bcrypt.hash(this.password,saltRounds)
// //         .try( (hash) => {
// //             console.log(hash)
// //             this.password = hash   
// //         }).catch(err => {
// //             throw Error('Encryption error',err)
// //         })
     
// //          }
// //          next();
// //      });
// userSchema.pre("save", async function(next) {
//     const saltRounds = 10;

//     if (this.isModified("password")) {
//         try {
//             const hashedPassword = await bcrypt.hash(this.password, saltRounds);
//             console.log(hashedPassword);
//             this.password = hashedPassword;   
//         } catch (err) {
//             return next(new Error('Encryption error: ' + err.message));
//         }
//     }
//     next();
// });

     
//      //
    

//  const User = mongoose.model('USER', userSchema);

//  module.exports = User;

// module.exports = mongoose.model("user",userSchema);
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// // const saltRounds = process.env.SALT_ROUNDS || 10;

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       default: 'user',
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, 'Password is required'],
//     },
//     age: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     gender: {
//         type: String,
//         enum: ['Male', 'Female', 'Other'],
//         required: true
//     },
//     phone: {
//         type: String,
//         required: true,
//         unique: true,
//         match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
//     },
//     bloodType: {
//         type: String,
//         enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
//         required: true
//     }
    
//     // Uncomment if using JWT tokens in your app:
//     // tokens: [
//     //     {
//     //         token: {
//     //             type: String,
//     //             required: true
//     //         }
//     //     }
//     // ],
//     status: {
//       type: String,
//       default: 'active',
//     },
//   },
//   { timestamps: true }
// );

// // Hash the password before saving the user
// userSchema.pre('save', async function (next) {
//   const saltRounds = 10;

//   if (this.isModified('password')) {
//     try {
//       const hashedPassword = await bcrypt.hash(this.password, saltRounds);
//       this.password = hashedPassword;
//     } catch (err) {
//       return next(new Error('Encryption error: ' + err.message));
//     }
//   }
//   next();
// });

// // Model creation
// const User = mongoose.model('User', userSchema);

// module.exports = User;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const saltRounds = process.env.SALT_ROUNDS || 10; // Use environment variable for salt rounds or default to 10

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true, // Ensures email is stored in lowercase
    trim: true, // Removes leading and trailing spaces
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  age: {
    type: Number,
    required: true,
    min: [0, 'Age must be a positive number'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'], // Ensure these match the input values
    required: true
 
    // set: (value) => {
    //   // Convert to Title Case
    //   const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    //   return capitalizedValue;
    // }
},
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true,
  },
  status: {
    type: String,
    default: 'active',
  },
  // Uncomment if using JWT tokens in your app:
  // tokens: [
  //   {
  //     token: {
  //       type: String,
  //       required: true
  //     }
  //   }
  // ],
}, { timestamps: true });

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
    const saltRounds = 10;
  if (this.isModified('password') || this.isNew) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword;
      next();
    } catch (err) {
      next(new Error('Encryption error: ' + err.message));
    }
  } else {
    next();
  }
});

// Model creation
const User = mongoose.model('User', userSchema);

module.exports = User;
