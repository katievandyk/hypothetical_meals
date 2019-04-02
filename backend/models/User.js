const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
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
    required: true
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
  }]
});
module.exports = User = mongoose.model("users", UserSchema);