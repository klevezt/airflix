var mongoose = require("mongoose");

const Schema = mongoose.Schema;

var imageSchema = new Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

//Image is a model which has a schema imageSchema

module.exports = new mongoose.model("Image", imageSchema);
