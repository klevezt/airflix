const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const foodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    type: {
      type: String,
      required: true,
    },
    special_features: {
      type: Array,
      required: false,
      default: [],
    },
    ingredients: {
      type: Array,
      required: false,
      default: [],
    },
    image: {
      type: String,
      required: true,
      default: "",
    },
    description: {
      type: String,
      required: false,
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

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;
