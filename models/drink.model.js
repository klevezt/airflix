const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const drinkSchema = new Schema(
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
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    ingredients: {
      type: Array,
      required: false,
      default: [],
    },
    images: {
      type: Array,
      required: true,
      default: [],
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
    featured: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model("Drink", drinkSchema);

module.exports = Food;
