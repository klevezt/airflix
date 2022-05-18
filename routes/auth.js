const router = require("express").Router();
// const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
let Users = require("../models/user.model");

require("dotenv").config();

// Error status code
// 401 Unauthorized: it’s for authentication, not authorization. Server says "you're not authenticated".
// 403 Forbidden: it's for authorization. Server says "I know who you are,
//                but you just don’t have permission to access this resource".

///////////////////////////

let refreshTokens = [];

// Log in
router.route("/login").post(async (req, res) => {
  const { username, password } = req.body;

  // Look for user email in the database
  const user = await Users.findOne({ username });

  // If user not found, send error message
  if (!user) {
    return res.status(400).json({
      errors: [
        {
          msg: "Invalid credentials",
        },
      ],
    });
  }

  // Compare hased password with user password to see if they are valid
  let isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      errors: [
        {
          msg: "Email or password is invalid",
        },
      ],
    });
  }

  // Send JWT access token
  const accessToken = await JWT.sign({ username }, process.env.TOKEN_KEY, {
    expiresIn: "20s",
  });

  // Refresh token
  const refreshToken = await JWT.sign({ username }, process.env.REFRESH_KEY, {
    expiresIn: "60s",
  });

  // Set refersh token in refreshTokens array
  refreshTokens.push(refreshToken);

  res.status(200).json({ user, accessToken, refreshToken });
});

// Create new access token from refresh token
router.route("/token").post(async (req, res) => {
  const refreshToken = req.header("x-access-token");

  // If token is not provided, send error message
  if (!refreshToken) {
    res.status(401).json({
      errors: [
        {
          msg: "Token not found",
        },
      ],
    });
  }

  // If token does not exist, send error message
  if (!refreshTokens.includes(refreshToken)) {
    res.status(403).json({
      errors: [
        {
          msg: "Invalid refresh token",
        },
      ],
    });
  }

  try {
    const user = await JWT.verify(refreshToken, process.env.REFRESH_KEY);
    // user = { email: 'jame@gmail.com', iat: 1633586290, exp: 1633586350 }
    const { username } = user;
    const accessToken = await JWT.sign({ username }, process.env.TOKEN_KEY, {
      expiresIn: "20s",
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({
      errors: [
        {
          msg: "Invalid token",
        },
      ],
    });
  }
});

// Deauthenticate - log out
// Delete refresh token
router.route("/logout").delete(async (req, res) => {
  const refreshToken = req.header("x-access-token");

  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.sendStatus(204);
});

module.exports = router;
