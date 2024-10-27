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
    return res.status(401).send("Unauthorized: No token provided");
  }

  const secretKey = process.env.SECRET_KEY;

  try {
    const verified = jwt.verify(token, secretKey);

    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

module.exports = authMiddleware;
