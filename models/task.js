const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var shortid = require('shortid-36');

var taskSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      default: shortid.generate,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    soft_deadline: {
      type: Date,
      required: true,
    },
    hard_deadline: {
      type: Date,
      required: true,
    },
    client: {
      ref: 'User',
      required: true,
      type: Schema.Types.ObjectId,
    },
    wordcount: {
      type: Number,
      required: true,
    },
    taskcomm: {
      ref: 'Comm',
      type: Schema.Types.ObjectId,
    },
    createdby: {
      ref: 'User',
      required: true,
      type: Schema.Types.ObjectId,
    },
    orderId: {
      ref: 'Task',
      default: null,
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Export the modelname
module.exports = mongoose.model('Task', taskSchema);
