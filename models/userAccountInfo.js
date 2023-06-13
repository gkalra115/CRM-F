const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var UserAccountInfo = new Schema(
  {
    accountNumber: {
        type: Number,
        trim: true,
        unique: true,
        required: true
    },
    IFSC: {
      type: String,
      trim: true,
      required: true,
    },
    accountHolder: {
      type: String,
      trim: true,
      required: true
    },
    bank: {
      type: String,
      required: true
    },
    userId: {
      ref: "User",
      type: Schema.Types.ObjectId,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Export the modelname
module.exports = mongoose.model("UserAccountInfo", UserAccountInfo);
