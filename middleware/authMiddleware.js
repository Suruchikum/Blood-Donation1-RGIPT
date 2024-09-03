const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

// function verifyToken(req, res, next) {
//     const token = req.header('Authorization') || req.query.token  ||  req.cookies.token;
//     if (!token) return res.status(401).json({ error: 'Access denied' });

//     try {
//     const decoded = jwt.verify(token, secret);
//     req.userId = decoded.userId;
//     next();
//     } catch (error) {
//     return res.status(401).json({ error: 'Invalid token' });
//     }
//  };
// function verifyToken(req, res, next) {
//     const authHeader = req.header('Authorization');
//     const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.query.token || req.cookies.token;

//     if (!token) {
//         return res.status(401).json({ error: 'Access denied' });
//     }

//     try {
//         const secret = process.env.SECRET; // Load the secret from environment variables
//         const decoded = jwt.verify(token, secret);
//         req.userId = decoded.userId; // Store decoded user ID in request object
//         next();
//     } catch (error) {
//         console.error('JWT Verification Error:', error); // Optional, for debugging
//         return res.status(401).json({ error: 'Invalid token' });
//     }
// };

//   const verifyToken = (req, res, next) => {
//      const token = req.cookies.token || req.query.token;
//      if (!token) {
//           return res.status(403).send('Token is required');
//     }
//      try {
//          const decoded = jwt.verify(token, secret);
//         req.user = decoded;
//     } catch (err) {
//          return res.status(401).send('Invalid Token');
//      }
//      return next();
//  };
const verifyToken = (req, res, next) => {
   const token =
    req.cookies.token ||
     req.query.token ||
     req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).send("Token is required");
   }

   try {
     const secret = process.env.SECRET; // Ensure your secret is loaded from environment variables
     const decoded = jwt.verify(token, secret);
     req.user = decoded;
   } catch (err) {
     console.error("JWT Verification Error:", err); // Optional, for debugging
     return res.status(401).send("Invalid Token");
   }

   next();
 };

// Middleware to verify the token
// const verifyToken = (req, res, next) => {
//   try {
//     // Check if authorization header is set
//     const authHeader = req.headers['authorization'];

//     if (!authHeader) {
//       return res.status(401).json({ message: 'Authorization header is missing' });
//     }

//     // Split 'Bearer' and token
//     const token = authHeader.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ message: 'Token is missing' });
//     }

//     // Verify the token
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//       if (err) {
//         return res.status(403).json({ message: 'Invalid token' });
//       }

//       // Attach user info to request object
//       req.user = user;
//       next();
//     });
//   } catch (error) {
//     console.error('Error verifying token:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// function verifyToken(req, res, next) {
//   //     // Attempt to get token from various sources
//   let token =
//     req.header("Authorization") || req.query.token || req.cookies.token;

//   //     // Log the token for debugging purposes
//   console.log("Authorization Header:", req.header("Authorization"));
//   console.log("Query Token:", req.query.token);
//   console.log("Cookies Token:", req.cookies.token);

//   //     // Check if token is from 'Authorization' header and extract it
//   if (token && token.startsWith("Bearer ")) {
//     token = token.split(" ")[1]; // Extract the token after 'Bearer '
//   }

//   //     // Log the extracted token
//   console.log("Extracted Token:", token);

//   //     // If no token is found, return a 401 unauthorized response
//   if (!token) {
//     return res.status(401).json({ error: "Access denied. No token provided." });
//   }

//   //     // Ensure secret is defined from environment variables
//   const secret = process.env.JWT_SECRET;
//   if (!secret) {
//     console.error("JWT_SECRET is not defined in environment variables.");
//     return res.status(500).json({ error: "Internal server error." });
//   }

//   try {
//     // Verify the token using the secret key
//     const decoded = jwt.verify(token, secret);
//     req.userId = decoded.userId; // Store user ID from the token in the request object
//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     //         // If the token verification fails, return a 401 unauthorized response
//     console.error("Token verification failed:", error.message);
//     return res.status(401).json({ error: "Invalid token." });
//   }
// }

// verifyToken= async(req,res,next) => {
//     try{
//         const token = req.headers['authorization'].split("")[1]
//         jwt.verify(token,process.env.JWT_SECRET,(err,decode) =>{
//             if(err){
//                 return res.status(401).send({
//                     success:false,
//                     message:'Auth Failed'
//                 })

//             }
//             else{
//                 req.body.userId = decode.id;
//                 next();
//             }
//         });
//     }
//     catch(error){
//         console.log(error)
//         return res.status(401).send({
//             success:false,
//             error,
//             message: 'Auth Failed'
//         });
//     }
// };
// function verifyToken(req, res, next) {
//     // Token ko retrieve karne ki koshish
//     let token = req.header('Authorization') || req.query.token || req.cookies.token;

//     // Check karein ki token defined hai aur string hai, aur 'Bearer ' se start ho raha hai
//      if (typeof token === 'string' ) {
//         // Token se 'Bearer ' hata ke actual token value ko assign karein
//         // token = token.split(' ')[1];
//         token  = string;
//     } else {
//         // Agar token invalid hai, toh null set karein
//         token = null;
//     }

//     // Token ki existence ko check karein
//     if (!token) {
//         return res.status(401).json({ error: 'Access denied. No token provided.' });
//     }

//     const secret = process.env.JWT_SECRET;
//     if (!secret) {
//         console.error('JWT_SECRET environment variable is not defined.');
//         return res.status(500).json({ error: 'Internal server error.' });
//     }

//     try {
//         const decoded = jwt.verify(token, secret);
//         req.userId = decoded.userId;
//         next();
//     } catch (error) {
//         console.error('Token verification failed:', error.message);
//         return res.status(401).json({ error: 'Invalid token.' });
//     }
// }

module.exports = { verifyToken };
