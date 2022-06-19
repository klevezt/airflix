const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const infoSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    alias: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      default: "",
    },
    featured: {
      type: Boolean,
      required: false,
      default: false,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    content: {
      type: Array,
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Info = mongoose.model("Info", infoSchema);

module.exports = Info;
