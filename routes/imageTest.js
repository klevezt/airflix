const path = require("path");
const router = require("express").Router();

let Image = require("../models/imageTest.model");
const multer = require("multer");
const fs = require("fs");

var upload = multer({ storage: storage });

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

router.route("/").get((req, res) => {
  Image.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.json({ items: items });
    }
  });
});

router.route("/uploads").post(upload.single("image"), (req, res) => {
  var obj = {
    img: {
      data: fs.readFileSync(
        path.join(__dirname + "/../uploads/" + req.body.filename)
      ),
      contentType: req.body.type,
    },
  };
  const newImage = new Image(obj);

  newImage.save().then(() => res.json("Review added!"));
});

module.exports = router;
