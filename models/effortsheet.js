const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var effortsheetSchema = new Schema(
  {
    taskid: {
      ref: 'Task',
      type: String
    },
    title: {
      type: String
    },
    submittedon: {
      type: Date,
      required: true,
    },
    achived_wordcount: {
      type: Number,
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    approvedby: {
      ref: 'User',
      type: Schema.Types.ObjectId,
    },
    comments:{
      type:String,
      default: ''
    },
    doneby:{
      ref: 'User',
      required: true,
      type: Schema.Types.ObjectId,
    }
  },
  {
    timestamps: true,
  }
);

// Export the modelname
module.exports = mongoose.model('Effortsheet', effortsheetSchema);
