const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var paraphasecontent = new Schema(
  {
    
    prompt: {
      type: String,
      required: true
    },
    completion: {
        type: String,
        required: true
    },
    checked: { 
        type: Boolean, 
        default: false 
    }
  },
  {
    timestamps: true
  }
);

// Export the modelname
module.exports = mongoose.model("Paraphaser", paraphasecontent);
