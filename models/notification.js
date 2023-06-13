const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    resource: {
      type: String,
      required: true,
      enum: ['Task', 'Payment', 'User'],
    },
    resourceId: {
      type: Array,
      required: true,
      default: [],
    },
    typeof: {
      type: String,
    },
    actionTakenById: {
      type: Array,
      required: true,
      default: [],
    },
    actionEffectsToId: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        flag: {
          type: Boolean,
          default: false,
        },
        readAt: {
          type: Date,
          default: null,
        },
        starred: {
          type: Boolean,
          default: false,
        },
      },
    ],
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
