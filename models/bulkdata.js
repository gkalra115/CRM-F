const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var dataSchema = new Schema(
  {
    taskid: {
      type: String,
    },
    Year: {
      type: Number,
    },
    Month: {
      type: Number,
    },
    Link: {
      type: String,
    },
    uploadtype: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
// Export the modelname
dataSchema.index({
  taskid: 'text',
  Link: 'text',
  uploadtype: 'text',
  Year: 'text',
  Month: 'text',
});
module.exports = mongoose.model('BulkData', dataSchema);
