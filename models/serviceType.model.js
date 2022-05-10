const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const serviceTypeSchema = new Schema(
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

const ServiceType = mongoose.model("ServiceType", serviceTypeSchema);

module.exports = ServiceType;
