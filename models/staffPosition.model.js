const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StaffPositionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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

const StaffPosition = mongoose.model("Staff Position", StaffPositionSchema);

module.exports = StaffPosition;
