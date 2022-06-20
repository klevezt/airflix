const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const alacarteSchema = new Schema(
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
    featured: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Alacarte = mongoose.model("Alacarte", alacarteSchema);

module.exports = Alacarte;
