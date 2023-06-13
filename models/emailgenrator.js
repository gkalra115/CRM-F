const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var emailcontent = new Schema(
  {
    
    prompt: {
      type: String,
      required: true
    },
    completion: {
        type: String,
        required: true
    },
    createdby: {
        ref: 'User',
        required: true,
        type: Schema.Types.ObjectId,
      },
    tokenconsumed:{
        type: Number,
        required: true
    }
  },
  {
    timestamps: true
  }
);

// Export the modelname
module.exports = mongoose.model("Emailcontent", emailcontent);
