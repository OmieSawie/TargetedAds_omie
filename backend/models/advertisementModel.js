const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advertisementSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title should be specified"],
  },
  tags:{
    type:[String],
  },
  description: {
    type: String,
    required: [true, "Description should be specified"],
  },
  imageUrl:{
    type:String,
    required:[true,"Image path must be specified"],
  },
  businessName:{
    type:String,
    required:[true,"Business name must be specified"]
  },
 });

module.exports = mongoose.model("advertisement", advertisementSchema);
