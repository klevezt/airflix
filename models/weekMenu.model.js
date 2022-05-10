const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const weekMenuSchema = new Schema(
  {
    week: {
      type: Number,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      trim: true,
    },
    month: {
      type: Number,
      required: true,
      trim: true,
    },
    monday: {
      type: Object,
      required: true,
      default: {},
    },
    tuesday: {
      type: Object,
      required: true,
      default: {},
    },
    wednesday: {
      type: Object,
      required: true,
      default: {},
    },
    thursday: {
      type: Object,
      required: true,
      default: {},
    },
    friday: {
      type: Object,
      required: true,
      default: {},
    },
    saturday: {
      type: Object,
      required: true,
      default: {},
    },
    sunday: {
      type: Object,
      required: true,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const weekMenu = mongoose.model("weekMenu", weekMenuSchema);

module.exports = weekMenu;
