const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transactionValue: {
      type: Number,
      required: true,
    },
    transactionCurrency: {
      type: String,
      enum: ['AUD', 'INR', 'USD', 'NZD', 'CAD', 'GBP'],
      required: true,
    },
    paymentAccount: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    receivedOn:{
      type:Date,
      required: true
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Transaction', transactionSchema);