const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  analyst: {
    type: Boolean,
    default: false
  },
  product: {
    type: Boolean,
    default: false
  },
  business: {
    type: Boolean,
    default: false
  },
  plant: {
    type: Boolean,
    default: false
  },
  lines: [{
    line: {
      type: Schema.Types.ObjectId,
      ref: 'manufacturingline'
    }
  }],
  isNetIdUser: {
    type: Boolean,
    default: false
  }
});
module.exports = User = mongoose.model("users", UserSchema);