const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var orderSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
    orderFiles: [
      {
        files: {
          type: String,
          required: true,
        },
        uploadpath: {
          type: String,
          required: true,
        },
        filetype: {
          type: String,
          required: true,
        },
        filesize: {
          type: Number,
          required: true,
        },
        uploadedby: {
          ref: 'User',
          type: Schema.Types.ObjectId,
        },
      },
    ],
    reqActionBy: {
      user: {
        ref: 'User',
        default: null,
        type: Schema.Types.ObjectId,
      },
      user_role: {
        type: String,
        enum: ['Admin', 'SuperAdmin'],
        default: null,
      },
      actionAt: {
        type: Date,
        default: null,
      },
      actionType: {
        type: String,
        enum: [
          'Rejected',
          'Processing',
          'Approved',
          'Un-Approved',
          'Delivered',
        ],
        default: 'Un-Approved',
      },
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
module.exports = mongoose.model('TaskOrder', orderSchema);
