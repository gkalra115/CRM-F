const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var paymentSchema = new Schema(
  {
    _id: {
      ref: 'Task',
      required: true,
      type: String,
    },
    budget: {
      type: Number,
    },
    amount_paid: {
      type: Number,
    },
    currency: {
      type: String,
      enum: ['AUD', 'INR', 'USD', 'NZD', 'CAD', 'GBP'],
      default: 'AUD'
    },
    locked: {
      type: Boolean,
      default: false,
    },
    lastUpdated: {
      type: Date,
    },
    paymentlogs:[{
      budget: {
        type: Number,
      },
      amount_paid: {
        type: Number,
      },
      updateTime: {
        type: Date,
      },
      currency: {
        type: String,
        enum: ['AUD', 'INR', 'USD', 'NZD', 'CAD', 'GBP']
      },
      createdAt: {type: Date}
    }]
}
);
// Export the modelname
module.exports = mongoose.model('Payment', paymentSchema);
