const jwt = require("jsonwebtoken");
require("dotenv").config();

const authToken = async (req, res, next) => {
  // Option 1
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1]; // Bearer Token

  // Option 2
  const token = req.header("x-access-token");

  // If token not found, send error message
  if (!token) {
    return res.status(401).json({
      error: {
        msg: "Token not found",
      },
    });
  }

  // Authenticate token
  try {
    const user = await jwt.verify(token, process.env.TOKEN_KEY);
    req.user = user.username;
    next();
  } catch (error) {
    res.status(403).json({
      error: {
        msg: "Invalid token",
      },
    });
  }
};

module.exports = authToken;
