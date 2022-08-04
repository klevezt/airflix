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
const tokenExpiresIn = "10s";
const refreshTokenExpiresIn = "300s";

router.route("/login/redirect").post(async (req, res) => {
  const refreshToken = req.header("x-access-token");
  try {
    const tmpUser = JWT.verify(refreshToken, process.env.REFRESH_KEY);
    const { username } = tmpUser;
    const user = await Users.findOne({ username });
    if (refreshTokens.includes(refreshToken)) {
      console.log("YESSSS");
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      error: {
        msg: "Invalid token",
      },
    });
  }
});

// Log in
router.route("/login").post(async (req, res) => {
  const { username, password } = req.body;

  console.log(refreshTokens);

  // Look for user email in the database
  const user = await Users.findOne({ username });

  // If user not found, send error message
  if (!user) {
    return res.status(400).json({
      error: {
        msg: "Invalid credentials",
      },
    });
  }

  // Compare hased password with user password to see if they are valid
  let isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      error: {
        msg: "Email or password is invalid",
      },
    });
  }

  // Send JWT access token
  const accessToken = JWT.sign({ username }, process.env.TOKEN_KEY, {
    expiresIn: tokenExpiresIn,
  });

  // Refresh token
  const refreshToken = JWT.sign({ username }, process.env.REFRESH_KEY, {
    expiresIn: refreshTokenExpiresIn,
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
    return res.status(401).json({
      error: {
        msg: "Token not found",
      },
    });
  }

  // If token does not exist, send error message
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({
      error: {
        msg: "Invalid refresh token",
      },
    });
  }

  try {
    const user = JWT.verify(refreshToken, process.env.REFRESH_KEY);
    const { username } = user;
    const accessToken = JWT.sign({ username }, process.env.TOKEN_KEY, {
      expiresIn: tokenExpiresIn,
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({
      error: {
        msg: "Invalid token",
      },
    });
  }
});

// Deauthenticate - log out
// Delete refresh token
router.route("/logout").delete(async (req, res) => {
  const refreshToken = req.header("x-access-token");

  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(204);
});

module.exports = router;
