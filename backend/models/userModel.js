const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  emailId: {
    type: String,
    required: [true, "Please provide your email"],
    trim: true,
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  userName: {
    type: String,
    required: [true, "Name of the user should be specified"],
  },
  phoneNo: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: [true, "Role of the user should be specified"],
    enum: ["customer", "business", "superAdmin"],
    default: "customer",
  },
   advertisement: [{ type: Schema.Types.ObjectId, ref: "advertisement" }],
});

module.exports = mongoose.model("User", userSchema);
