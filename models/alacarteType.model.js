const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AlacarteTypeSchema = new Schema(
  {
    name: {
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
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const AlacarteType = mongoose.model("Alacarte Type", AlacarteTypeSchema);

module.exports = AlacarteType;
