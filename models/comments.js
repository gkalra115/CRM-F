const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentsSchema = new Schema(
  {
    commentby: {
      ref: 'User',
      type: Schema.Types.ObjectId,
    },
    taskid: {
      ref: 'Task',
      required: true,
      type: String,
    },
    comment: {
      type: String,
    },
    commentFile: {
      files: {
        type: String,
      },
      uploadpath: {
        type: String,
      },
      filetype: {
        type: String,
      },
      filesize: {
        type: Number,
      },
    },
    commentto: {
      ref: 'User',
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);
// Export the modelname
module.exports = mongoose.model('Comments', commentsSchema);
