const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var creditsSchema = new Schema(
  {
    user: {
      ref: 'User',
      type: String,
      required: true
    },
    tokens: {
      type: Number,
      required: true
    },
    amount:{
      type: Number
    },
    paymentid:{
      type: String
    },
    currency:{
      type: String
    },
    expiry:{
      type: Date,
      required: true
    },
    updatedBy:{
      ref: 'User',
      type: String
    },
    activity:{
      type: String,
      enum: ['transferred', 'purchased'],
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Export the modelname
module.exports = mongoose.model('Credits', creditsSchema);
