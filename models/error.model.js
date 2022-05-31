const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const errorSchema = new Schema(
  {
    content: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Error = mongoose.model("Error", errorSchema);

module.exports = Error;
