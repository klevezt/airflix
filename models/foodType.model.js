const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const foodTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    weekPropertyName: {
      type: String,
      required: true,
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

const FoodType = mongoose.model("Food Type", foodTypeSchema);

module.exports = FoodType;
