const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const saltRounds = process.env.SALT_ROUNDS ||10;

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
        
        },
    
    role:{
         type:String,
         default:"user"
     },
    email: {
        type:String,
        required:[true,"email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    // tokens:[
    //     {
    //         token:{
    //             type:String,
    //             required:true
    //         }
    //     }
    // ],
    
    status: {
        type:String,
        default:"active"
    },
},{timestamps: true});


// userSchema.pre("save",async function(next){
    
//       if(this.isModified("password")){
//        const hashedPassword = await bcrypt.hash(this.password,saltRounds)
//         .try( (hash) => {
//             console.log(hash)
//             this.password = hash   
//         }).catch(err => {
//             throw Error('Encryption error',err)
//         })
     
//          }
//          next();
//      });
userSchema.pre("save", async function(next) {
    const saltRounds = 10;

    if (this.isModified("password")) {
        try {
            const hashedPassword = await bcrypt.hash(this.password, saltRounds);
            console.log(hashedPassword);
            this.password = hashedPassword;   
        } catch (err) {
            return next(new Error('Encryption error: ' + err.message));
        }
    }
    next();
});

     
     //
    

 const User = mongoose.model('USER', userSchema);

 module.exports = User;

// module.exports = mongoose.model("user",userSchema);
