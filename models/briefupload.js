const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var taskfilesSchema = new Schema(
  {
    files: {
      type: String,
      required: true
    },
    taskid: {
      ref: "Task",
      required: true,
      type: String
    },
    uploadpath: {
      type: String,
      required: true
    },
    filetype: {
      type: String,
      required: true
    },
    filesize: {
      type: Number,
      required: true
    },
    uploadedby: {
      ref: "User",
      type: Schema.Types.ObjectId
    }
  },
  {
    timestamps: true
  }
);

// Export the modelname
module.exports = mongoose.model("Taskfiles", taskfilesSchema);
