const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      unique: false,
      minlength: 3,
    },
    status: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      required: true,
    },
    room_number: {
      type: String,
      required: false,
      default: "",
      unique: true,
    },
    room_type: {
      type: String,
      required: false,
      default: "",
    },
    hotel_info: {
      type: Object,
      required: false,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
