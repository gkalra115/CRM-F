const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      unique: true,
      //validate: [validateEmail, 'Please fill a valid email address'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    phone: {
      type: Number,
      trim: true,
      unique: true,
      required: true,
    },
    user_type: {
      type: String,
      enum: ['Freelancer', 'Employee', 'Client'],
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
    },
    originalpass: {
      type: String,
    },
    client: {
      country: {
        type: String,
      },
      university: String,
    },
    employee: {
      salary: {
        type: Number,
      },
      joiningDate: {
        type: Date,
      },
      user_role: {
        type: String,
        enum: ['SuperAdmin', 'Admin', 'Manager', 'TeamLead', 'Expert', 'BDM'],
      },
      endDate: {
        type: Date,
      },
    },
    createdby: {
      ref: 'User',
      type: Schema.Types.ObjectId,
      default: null,
    },
    assignedTo: {
      ref: 'User',
      type: Schema.Types.ObjectId,
      default: null,
    },
    
    bulkDataCreated: [
      {
        filename: {
          type: String,
        },
        taskIds: {
          type: Array,
          default: [],
        },
        addedOn: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Export the modelname
module.exports = mongoose.model('User', UserSchema);
