const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var statusSchema = new Schema(
  {
    _id: {
      ref: "Task",
      required: true,
      type: String
    },
    status: {
      type: String,
      enum: [
        "Unassigned",
        "Assigned to Admin",
        "Assigned to Manager",
        "Assigned to TeamLead",
        "Running",
        "Quality Check",
        "Completed",
        "Delivered"
      ],
      default: "Unassigned"
    }
  },
  {
    timestamps: true
  }
);
// Export the modelname
module.exports = mongoose.model("Status", statusSchema);
