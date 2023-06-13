const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SystemSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('System', SystemSchema);