const router = require("express").Router();

let weekMenu = require("../models/weekMenu.model");
const { validateToken } = require("./auth");

// router.all("*", [validateToken]);
router.route("/").get((req, res) => {
  const obj = req.query;
  weekMenu
    .find({ month: obj.month, year: obj.year })
    .then((week) => {
      res.json(week);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/getFullDay").get((req, res) => {
  const obj = req.query;
  weekMenu
    .find({ week: obj.week, month: obj.month, year: obj.year })
    .then((week) => {
      res.json(week);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const week = new weekMenu(req.body);

  week
    .save()
    .then(() => res.json("Week added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update").put((req, res) => {
  const obj = req.query;
  weekMenu
    .findOneAndUpdate(
      { year: obj.year, month: obj.month, week: obj.week },
      req.body,
      { new: true },
      (err, todo) => {
        // Handle any possible database errors
        if (err) return res.status(500).send(err);
        return res.send(todo);
      }
    )
    // .then((i) => console.log(i))
    .catch((err) => {
      console.log("Error" + err.message);
    });
});

module.exports = router;
