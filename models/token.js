const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var tokenSchema = new Schema(
  {
    user: {
      ref: 'User',
      type: String,
      required: true
    },
    updatedtokens: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Export the modelname
module.exports = mongoose.model('Token', tokenSchema);
