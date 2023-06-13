const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var attendanceSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timings: [
      {
        time: {
          type: Date,
          required: true,
        },
        isInTime: {
          type: Boolean,
          required: true,
        },
      },
    ],
    leave_type: {
      type: String,
      enum: [
        'Casual Leave',
        'Sick Leave',
        'Holiday',
        'Work From Home',
        'Un-Authorised',
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Export the modelname
module.exports = mongoose.model('Attendance', attendanceSchema);
