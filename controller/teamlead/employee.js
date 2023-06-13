//importing models from schema
const User = require("../../models/user");
const Task = require("../../models/task");
const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

exports.get_tl_getTeam = async (req, res, next) => {
  try {
    const userTeam = await User.aggregate([
      { $match: { _id: ObjectId(req.decoded.userId), is_active: true } },
      {
        $graphLookup: {
          from: "users",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "assignedTo",
          as: "team"
        }
      },
      { $unwind: "$team" },
      { $match: { "team.user_type": "Employee", 'team.is_active': true } },
      {
        $project: {
          _id: 0,
          id: "$team._id",
          name: "$team.name",
          role: "$team.employee.user_role",
          parent: "$team.assignedTo"
        }
      }
    ]);
    await User.populate(userTeam, {
      select: "name employee.user_role",
      path: "parent"
    });
    res.send(userTeam);
  } catch (error) {
    next(error);
  }
};

exports.get_tl_stats = async (req, res, next) => {
  try {
    var alltask = await Task.aggregate([
      {
        $lookup: {
          from: "comms",
          localField: "taskcomm",
          foreignField: "_id",
          as: "comm"
        }
      },
      { $unwind: "$comm" },
      {
        $match: {
          deleted: { $eq: false }
        }
      },
      {
        $project: {
          title: 1,
          wordcount: 1,
          deadline: "$soft_deadline",
          status: "$status.status",
          teamlead: "$comm.TeamLead",
          manager: "$comm.Manager"
        }
      },
      {
        $match: {
          teamlead: req.decoded.userId
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$wordcount" },
          count: { $sum: 1 }
        }
      }
    ]);
    res.send(alltask);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view single profile
exports.get_tl_profile = async (req, res, next) => {
  try {
    var singleemployee = await User.findById(req.decoded.userId);
    await User.populate(singleemployee, { select: "name", path: "assignedTo" });
    res.status(200).send(singleemployee);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};
