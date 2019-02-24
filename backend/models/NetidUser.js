const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const NetidUserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
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
  }
});
module.exports = NetidUser = mongoose.model("netidusers", NetidUserSchema);