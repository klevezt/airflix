const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let Users = require("../models/user.model");

router.route("/").post(async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  // Our login logic starts here
  try {
    // Validate user input
    if (!(username && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await Users.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign({ username, password }, process.env.TOKEN_KEY, {
        expiresIn: "300s",
      });
      const refreshToken = jwt.sign(
        { username, password },
        process.env.REFRESH_KEY,
        {
          expiresIn: "30d",
        }
      );

      // user
      res.status(200).json({ user, token, refreshToken });
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
