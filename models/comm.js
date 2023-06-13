const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commSchema = new Schema(
  {
    taskid: {
      ref: 'Task',
      type: String,
      required: true,
    },
    iterations: [
      {
        _id: false,
        Manager: {
          ref: 'User',
          type: String,
          default: null,
        },
        TeamLead: {
          ref: 'User',
          type: String,
          default: null,
        },
        Expert: {
          ref: 'User',
          type: String,
          default: null,
        },
      },
    ],
    Admin: {
      ref: 'User',
      type: String,
    },
    Manager: {
      ref: 'User',
      type: String,
    },
    TeamLead: {
      ref: 'User',
      type: String,
    },
    Expert: {
      ref: 'User',
      type: String,
    },
    BDM: {
      ref: 'User',
      type: String,
    },
    tasklogs: [
      {
        _id: false,
        assignedby: {
          ref: 'User',
          type: String,
        },
        assignedto: {
          ref: 'User',
          type: String,
        },
        softdeadline: {
          type: Date,
        },
        assignedon: {
          type: Date,
        },
        fileIds: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Solutionfiles',
            default: null,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);
// Export the modelname
module.exports = mongoose.model('Comm', commSchema);
