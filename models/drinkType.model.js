const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DrinkTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    images: {
      type: Array,
      required: true,
      default: [],
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

const DrinkType = mongoose.model("Drink Type", DrinkTypeSchema);

module.exports = DrinkType;
