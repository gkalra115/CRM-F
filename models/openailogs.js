const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var openAISchema = new Schema(
  {
    user: {
      ref: 'User',
      type: String,
      required: true
    },
    tokens: {
      type: Number,
      required: true
    },
    tool:{
      type: String,
      required: true
    },
    input:{
      type: String,
      required: true
    },
    output:{
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Export the modelname
module.exports = mongoose.model('OpenAI', openAISchema);
