const Task = require("../../models/task");
const Status = require("../../models/status");
const Payment = require("../../models/payment");
const Comment = require("../../models/comments");
const Comm = require("../../models/comm");
const User = require("../../models/user");
const EffortSheet = require('../../models/effortsheet');
const jwt_decode = require("jwt-decode");
const ObjectId = require("mongoose").Types.ObjectId;

// expert task list of current task
exports.get_expert_task_list = async (req, res, next) => {
  try {
    var experttask = await Task.aggregate([
      {
        $lookup: {
          from: "comms",
          localField: "_id",
          foreignField: "taskid",
          as: "Taskcomm"
        }
      },
      { $unwind: "$Taskcomm" },
      {
        $lookup: {
          from: "status",
          localField: "_id",
          foreignField: "_id",
          as: "Status"
        }
      },
      { $unwind: "$Status" },
      {
        $project: {
          title: 1,
          wordcount: 1,
          soft_deadline: 1,
          description: 1,
          Expert: "$Taskcomm.Expert",
          Manager: "$Taskcomm.Manager",
          TeamLead: "$Taskcomm.TeamLead",
          status: "$Status.status"
        }
      },
      {
        $match: {
          $and: [
            { Expert: req.decoded.userId },
            { status: { $ne: "Delivered" } },
            { status: { $ne: "Completed" } }
          ]
        }
      }
    ]);
    
    if (req.query.count == "yes") {
      var lengthtask = await experttask.length;
      res.status(200).send({
        count: lengthtask
      });
    } else {
      await User.populate(experttask, {
        select: "name",
        path: "Manager TeamLead Expert"
      });
      res.send({ status: "OK", data: experttask });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.get_expert_single_task = async (req, res, next) => {
  try {
    var comment = await Comment.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { commentto: ObjectId(req.decoded.userId) },
                { commentby: ObjectId(req.decoded.userId) }
              ]
            },
            { taskid: req.params.taskid }
          ]
        }
      },
      {
        $project: {
          commentby: 1,
          commentto: 1,
          comment: 1,
          createdAt: 1,
          'commentFile.files': 1,
          'commentFile.uploadpath': 1,
          'commentFile._id': 1
        }
      }
    ]);
    var taskdetails = await Task.aggregate([
      {
        $lookup: {
          from: "comms",
          localField: "_id",
          foreignField: "taskid",
          as: "Taskcomm"
        }
      },
      { $unwind: "$Taskcomm" },
      {
        $lookup: {
          from: "status",
          localField: "_id",
          foreignField: "_id",
          as: "Status"
        }
      },
      { $unwind: "$Status" },
      { $match: { _id: req.params.taskid } },
      {
        $project: {
          title: 1,
          wordcount: 1,
          soft_deadline: 1,
          description: 1,
          Expert: "$Taskcomm.Expert",
          Manager: "$Taskcomm.Manager",
          TeamLead: "$Taskcomm.TeamLead",
          status: "$Status.status"
        }
      },
      {
        $match: {
          Expert: req.decoded.userId
        }
      }
    ]);
    var userdetail = await Task.aggregate([
      {
        $lookup: {
          from: "comms",
          localField: "_id",
          foreignField: "taskid",
          as: "Taskcomm"
        }
      },
      { $unwind: "$Taskcomm" },
      { $match: { _id: req.params.taskid } },
      {
        $project: {
          _id: 0,
          Admin: "$Taskcomm.Admin",
          Expert: "$Taskcomm.Expert",
          Manager: "$Taskcomm.Manager",
          TeamLead: "$Taskcomm.TeamLead"
        }
      },
      {
        $match: { Expert: req.decoded.userId }
      }
    ]);
    await User.populate(taskdetails, {
      select: "name",
      path: "Manager TeamLead Expert"
    });
    await User.populate(comment, {
      select: "name",
      path: "commentto commentby"
    });
    await User.populate(userdetail, {
      select: "name",
      path: "Admin Manager TeamLead Expert"
    });
    res.json({ task: taskdetails, comments: comment, userdetails: userdetail });
  } catch (e) {
    next(e);
  }
};

//update status details
exports.put_status_update = async (req, res, next) => {
  var datetime = new Date();
  try {
    var assignto = null;
    var taskcom = await Comm.findOne({
      taskid: req.params.id
    });
    if (taskcom.TeamLead != null) {
      var assignto = taskcom.TeamLead;
    }
    else if (taskcom.TeamLead == null) {
      if (taskcom.Manager != null) {
        var assignto = taskcom.Manager;
      }
      else if (taskcom.Manager == null) {
        if (taskcom.Admin != null) {
          var assignto = taskcom.Admin;
        }
        else {
          var assignto = null;
        }
      }
    }
    const commdata = {
      assignedby: req.decoded.userId,
      assignedto: assignto,
      softdeadline: req.body.softdeadline,
      assignedon: datetime
    };
    var updatecomm = await Comm.findOneAndUpdate(
      { taskid: req.params.id },
      {
        $push: { tasklogs: commdata }
      },
      { new: true }
    );
    var updatestatus = await Status.findByIdAndUpdate(
      updatecomm.taskid,
      {
        status: "Quality Check"
      },
      { new: true }
    );
    res.status(200).send(updatestatus);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//delayed task
exports.get_delayed_task = async (req, res, next) => {
  try {
    var alltask = await Task.aggregate([
      {
        $lookup: {
          from: "status",
          localField: "_id",
          foreignField: "_id",
          as: "status"
        }
      },
      {
        $lookup: {
          from: "comms",
          localField: "taskcomm",
          foreignField: "_id",
          as: "comm"
        }
      },
      { $unwind: "$status" },
      { $unwind: "$comm" },
      {
        $match: {
          $and: [
            { soft_deadline: { $lt: new Date() } },
            {
              deleted: { $eq: false }
            }
          ]
        }
      },
      {
        $project: {
          title: 1,
          deadline: "$soft_deadline",
          status: "$status.status",
          teamlead: "$comm.TeamLead",
          expert: "$comm.Expert",
          wordcount: 1
        }
      },
      {
        $match: {
          $and: [
            { expert: req.decoded.userId },
            { status: { $ne: "Completed" } },
            { status: { $ne: "Delivered" } }
          ]
        }
      }
    ]);
    if (req.query.count == "yes") {
      var lengthtask = await alltask.length;
      res.status(200).send({
        count: lengthtask
      });
    } else {
      await User.populate(alltask, { select: "name", path: "teamlead" });
      res.status(200).json({ status: "OK", data: alltask });
    }
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//all task
exports.get_all_task = async (req, res, next) => {
  try {
    var alltask = await Task.aggregate([
      {
        $lookup: {
          from: "status",
          localField: "_id",
          foreignField: "_id",
          as: "status"
        }
      },
      {
        $lookup: {
          from: "comms",
          localField: "taskcomm",
          foreignField: "_id",
          as: "comm"
        }
      },
      { $unwind: "$status" },
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
          expert: "$comm.Expert"
        }
      },
      {
        $match: {
          expert: req.decoded.userId
        }
      }
    ]);
    if (req.query.count == "yes") {
      var lengthtask = await alltask.length;
      res.status(200).send({
        count: lengthtask
      });
    } else {
      await User.populate(alltask, { select: "name", path: "teamlead" });
      res.status(200).json({ status: "OK", data: alltask });
    }
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//create task in efforttask
exports.post_efforttask = async (req, res, next) => {
  try {
    if(req.body.taskid != null){
      var validatetaskid = await Task.count({"_id":req.body.taskid});
      if(validatetaskid == 0){
      res.status(400).send("Task Dont Exist");
      }
      else{
        const { taskid, title, submittedon,comments, achived_wordcount } = req.body;
        const doneby = req.decoded.userId;
        const createeffort = new EffortSheet({
          taskid: taskid,
          title,
          comments,
          submittedon: submittedon,
          achived_wordcount: achived_wordcount,
          doneby: doneby
        });

        await createeffort.save();
        
        res.status(201).json({
          createeffort
        });
      }
    }   
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
}

//get efforts for expert
exports.get_all_effort = async (req, res, next) => {
  try{
    var empid = req.decoded.userId;
    if (req.query.month == null) {
      var effortsheet = await EffortSheet.aggregate([
        {
          $match: {
            $and: [{ doneby: ObjectId(empid) }],
          }
        },
        {
          $project: {
            taskid: 1,
            title:1,
            approved: 1,
            achived_wordcount: 1,
            comments:1,
            submittedon:1
          },
        },
        { $sort: { submittedon: -1 } },
        ])
        var statssheet = await EffortSheet.aggregate([
          {
            $match: {
              $and: [{ doneby: ObjectId(empid) }],
            }
          },
          {
            $project: {
              taskid: 1,
              achived_wordcount: 1
            },
          },
          {
            $group: {
              _id: '$aprroved',
              totalwordcount: {
                $sum: '$achived_wordcount',
              },
              totaltask: { $sum: 1 },
            },
          }
          ])
    }
    else{
      const month = req.query.month;
      const year = req.query.year;
      var effortsheet = await EffortSheet.aggregate([
        {
          $match: {
            $and: [{ doneby: ObjectId(empid) }],
          }
        },
        {
          $project: {
            taskid: 1,
            title: 1,
            approved: 1,
            achived_wordcount: 1,
            submittedon:1,
            comments:1,
            month: { $month: '$submittedon' },
            year: { $year: '$submittedon' },
          },
        },
        {
          $match: {
            month: Number(month),
            year: Number(year),
          },
        },
        { $sort: { submittedon: -1 } },
        ])
        var statssheet = await EffortSheet.aggregate([
          {
            $match: {
              $and: [{ doneby: ObjectId(empid) }],
            }
          },
          {
            $project: {
              taskid: 1,
              achived_wordcount: 1,
              month: { $month: '$submittedon' },
              year: { $year: '$submittedon' },
            },
          },
          {
            $match: {
              month: Number(month),
              year: Number(year),
            },
          },
          {
            $group: {
              _id: '$aprroved',
              totalwordcount: {
                $sum: '$achived_wordcount',
              },
              totaltask: { $sum: 1 },
            },
          }
          ])
    }
    const userdetails = {"name": req.decoded.name,"role":req.decoded.userDetails.user_role}
    res.status(200).json({ status: "OK",userdetails:userdetails,stats:statssheet,data: effortsheet });

  } catch (e){

  }
};



exports.validate_task = async (req, res, next) => {
  try {  
    var taskkey = req.params.taskid;
    var taskdetails = await Task.findOne({_id:taskkey})
    if(taskdetails){
      res.status(200).json(taskdetails)
    }
    else{
      res.status(400).json({msg:"No task found"})
    }
    

  } catch (e) {
    res.status(400).send({ msg: e.errmsg });
  }
};


//task stats
exports.get_ex_stats = async (req, res, next) => {
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
          expert: "$comm.Expert"
        }
      },
      {
        $match: {
          expert: req.decoded.userId
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
exports.get_ex_profile = async (req, res, next) => {
  try {
    var singleemployee = await User.findById(req.decoded.userId);
    await User.populate(singleemployee, { select: "name", path: "assignedTo" });
    res.status(200).send(singleemployee);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

exports.get_incentivecalc = async (req, res, next) => {
  try {
    //var singleemployee = await User.find(req.decoded.userId);
    var dt = new Date();
    var month = dt.getMonth();
    var year = dt.getFullYear();
    daysInMonth = new Date(year, month, 0).getDate() + 1; // 31 days
    var workingdays = daysInMonth - req.body.publicholiday - 1.5;
    var wordsperday = 50000/workingdays;
    var workingdays = req.body.wordcount/wordsperday;
    var paiddays = workingdays + 1.5 + Number(req.body.publicholiday);
    var payperday = 15000/Number(30);
    var totalsal = payperday * paiddays;
    var incentive = Math.round(totalsal) - 15000;
    var percent = Math.round(incentive/150)
    res.status(200).send({"incentive":incentive, "percent":percent});
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
}