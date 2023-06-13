const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var credentialsSchema = new Schema(
  {
    clientid: {
      ref: "User",
      required: true,
      type: Schema.Types.ObjectId
    },
    studentname: {
      type: String,
      required: true
    },
    userid: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    University: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Export the modelname
module.exports = mongoose.model("Credentials", credentialsSchema);
