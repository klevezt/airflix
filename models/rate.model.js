const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rateSchema = new Schema(
  {
    author: {
      type: String,
      required: false,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    content: {
      type: String,
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

const Rate = mongoose.model("Rate", rateSchema);

module.exports = Rate;
