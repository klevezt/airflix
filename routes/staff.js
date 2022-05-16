const router = require("express").Router();

let Staff = require("../models/staff.model");
const { validateToken } = require("./auth");

// router.all("*", [validateToken]);
router.route("/").get((req, res) => {
  Staff.find(req.query)
    .then((staff) => {
      res.json(staff);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Staff.findById(req.params.id)
    .then((staff) => res.json(staff))
    .catch((err) => {
      console.log(err.message);
    });
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const alias = req.body.alias;
  const position = req.body.position;
  const image = req.body.image;
  const description = req.body.description;

  const newStaff = new Staff({
    name,
    alias,
    position,
    image,
    description,
  });

  newStaff.save().then(() => res.json("Staff added!"));
  // .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/status/:id").put((req, res) => {
  Staff.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) return res.status(500).send(err);
      return res.send(todo);
    }
  ).catch((err) => {
    console.log(err.message);
  });
});

router.route("/update/:id").put((req, res) => {
  Staff.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, todo) => {
      // Handle any possible database errors
      if (err) return res.status(500).send(err);
      return res.send(todo);
    }
  ).catch((err) => {
    console.log(err.message);
  });
});

router.route("/delete/:id").delete((req, res) => {
  Staff.findByIdAndDelete(req.params.id)
    .then(() => {
      res.json("Staff Successfully Deleted!!!!");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

module.exports = router;
