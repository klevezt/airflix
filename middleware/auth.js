const jwt = require("jsonwebtoken");

const config = process.env;

const validateToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    jwt.verify(token, config.TOKEN_KEY, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      req.user = user;
    });
  } catch (err) {
    return res.status(401).send("You are not authenticated");
  }
  return next();
};

const tokenRefresh = (req, res, next) => {
  const { refreshToken } = req.body;
  // if (refreshToken && refreshToken in refreshList) {
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);
  // console.log(decoded);

  const token = generateAccessToken(decoded.username, decoded.password);
  const refresh = generateRefreshToken(decoded.username, decoded.password);
  // req.content = {
  //   user: decoded.user,
  //   email: decoded.email,
  // };
  req.username = decoded.username;
  req.password = decoded.password;
  req.token = token;
  req.refreshToken = refresh;

  // addToList(refreshToken, token);
  // } else {
  //   return res.status(401).send("Can't refresh. Invalid Token");
  // }
  next();
};

function generateAccessToken(username, password) {
  return jwt.sign({ username, password }, process.env.TOKEN_KEY, {
    expiresIn: "10s",
  });
}

function generateRefreshToken(username, password) {
  return jwt.sign({ username, password }, process.env.REFRESH_KEY, {
    expiresIn: "30d",
  });
}

module.exports = { validateToken, tokenRefresh };
