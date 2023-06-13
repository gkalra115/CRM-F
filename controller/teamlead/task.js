const Task = require('../../models/task');
const Status = require('../../models/status');
const Payment = require('../../models/payment');
const Comment = require('../../models/comments');
const Taskcomm = require('../../models/comm');
const User = require('../../models/user');
const jwt_decode = require('jwt-decode');
const EffortSheet = require('../../models/effortsheet');
const ObjectId = require('mongoose').Types.ObjectId;

//delayed task
exports.get_delayed_task = async (req, res, next) => {
  try {
    var alltask = await Task.aggregate([
      {
        $lookup: {
          from: 'status',
          localField: '_id',
          foreignField: '_id',
          as: 'status',
        },
      },
      {
        $lookup: {
          from: 'comms',
          localField: 'taskcomm',
          foreignField: '_id',
          as: 'comm',
        },
      },
      { $unwind: '$status' },
      { $unwind: '$comm' },
      {
        $match: {
          $and: [
            { soft_deadline: { $lt: new Date() } },
            {
              deleted: { $eq: false },
            },
          ],
        },
      },
      {
        $project: {
          title: 1,
          deadline: '$soft_deadline',
          status: '$status.status',
          manager: '$comm.Manager',
          teamlead: '$comm.TeamLead',
          expert: '$comm.Expert',
        },
      },
      {
        $match: {
          $and: [
            { teamlead: req.decoded.userId },
            { status: { $ne: 'Completed' } },
            { status: { $ne: 'Delivered' } },
          ],
        },
      },
    ]);
    if (req.query.count == 'yes') {
      var lengthtask = await alltask.length;
      res.status(200).send({
        count: lengthtask,
      });
    } else {
      await User.populate(alltask, {
        select: 'name',
        path: 'teamlead manager expert',
      });
      res.status(200).json({ status: 'OK', data: alltask });
    }
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//list of current running task
exports.get_teamlead_task_list = async (req, res, next) => {
  try {

    var tasklist = await Taskcomm.find(
      {
        TeamLead: req.decoded.userId
      },
      {
        taskid: 1,
        TeamLead: 1,
        Expert: 1
      }
    );
    var taskIds = tasklist.map((taskid) => taskid.taskid);

    let query = {};


    query = {
      status:
      {
        $nin: ["Delivered", "Completed"]
      }
    };
    var tasks = await Status.aggregate([
      {
        $match: {
          _id: { $in: taskIds },
          ...query,
        },
      },
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: '_id',
          as: 'Task',
        },
      },
      {
        $unwind: {
          path: '$task',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: 'comms',
          localField: 'Task._id',
          foreignField: 'taskid',
          as: 'Taskcomm',
        },
      },
      {
        $unwind: {
          path: '$Taskcomm',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          title: `$Task.title`,
          wordcount: `$Task.wordcount`,
          soft_deadline: `$Task.soft_deadline`,
          status: 1,
          Manager: '$Taskcomm.Manager',
          Expert: '$Taskcomm.Expert',
          Teamlead: '$TeamLead.name'
        },
      }
    ]);

    if (req.query.count == 'yes') {
      var lengthtask = await tasks.length;
      res.status(200).send({
        count: lengthtask,
      });
    } else {
      await User.populate(tasks, {
        select: 'name',
        path: 'Manager TeamLead Expert',
      });
      res.send({ status: 'OK', data: tasks });
    }
  } catch (e) {
    console.log(e);
  }
};

// exports.get_teamlead_task_list = async (req, res, next) => {
//   try {

//   } catch (e) {
//     console.log(e);
//   }
// }

// exports.get_teamlead_task_list = async (req, res, next) => {
//   try {
//     await Task.ensureIndexes(); // ensure appropriate indexes are created

//     var teamleadtask = await Task.aggregate([
//       {
//         $match: {
//           'Taskcomm.TeamLead': req.decoded.userId,
//           'Status.status': { $nin: ['Delivered', 'Completed'] }
//         }
//       },
//       {
//         $lookup: {
//           from: 'comms',
//           let: { taskId: '$_id' },
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $eq: ['$taskid', '$$taskId'] },
//                 'Taskcomm.TeamLead': req.decoded.userId
//               }
//             },
//             {
//               $project: {
//                 Expert: 1,
//                 Manager: 1,
//                 TeamLead: 1
//               }
//             }
//           ],
//           as: 'Taskcomm'
//         }
//       },
//       { $unwind: '$Taskcomm' },
//       {
//         $lookup: {
//           from: 'status',
//           localField: '_id',
//           foreignField: '_id',
//           as: 'Status',
//         },
//       },
//       { $unwind: '$Status' },
//       {
//         $project: {
//           title: 1,
//           wordcount: 1,
//           soft_deadline: 1,
//           Expert: '$Taskcomm.Expert',
//           Manager: '$Taskcomm.Manager',
//           TeamLead: '$Taskcomm.TeamLead',
//           status: '$Status.status',
//         },
//       }
//     ]);

//     console.log(teamleadtask)
//     if (req.query.count == 'yes') {
//       var lengthtask = await teamleadtask.length;
//       res.status(200).send({
//         count: lengthtask,
//       });
//     } else {
//       await User.populate(teamleadtask, {
//         select: 'name',
//         path: 'Manager TeamLead Expert',
//       });
//       res.send({ status: 'OK', data: teamleadtask });
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };


//list of all task
exports.get_all_task = async (req, res, next) => {
  try {
    var alltask = await Task.aggregate([
      {
        $lookup: {
          from: 'status',
          localField: '_id',
          foreignField: '_id',
          as: 'status',
        },
      },
      {
        $lookup: {
          from: 'comms',
          localField: 'taskcomm',
          foreignField: '_id',
          as: 'comm',
        },
      },
      { $unwind: '$status' },
      { $unwind: '$comm' },
      {
        $match: {
          deleted: { $eq: false },
        },
      },
      {
        $project: {
          title: 1,
          wordcount: 1,
          deadline: '$soft_deadline',
          status: '$status.status',
          manager: '$comm.Manager',
          teamlead: '$comm.TeamLead',
          expert: '$comm.Expert',
        },
      },
      {
        $match: {
          teamlead: req.decoded.userId,
        },
      },
    ]);
    if (req.query.count == 'yes') {
      var lengthtask = await alltask.length;
      res.status(200).send({
        count: lengthtask,
      });
    } else {
      await User.populate(alltask, {
        select: 'name',
        path: 'teamlead manager expert',
      });
      res.status(200).json({ status: 'OK', data: alltask });
    }
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

// Single task page
exports.get_tl_single_task = async (req, res, next) => {
  try {
    var comment = await Comment.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { commentto: ObjectId(req.decoded.userId) },
                { commentby: ObjectId(req.decoded.userId) },
              ],
            },
            { taskid: req.params.taskid },
          ],
        },
      },
      {
        $project: {
          commentby: 1,
          commentto: 1,
          comment: 1,
          createdAt: 1,
          commentFile: 1,
        },
      },
    ]);
    var taskdetails = await Task.aggregate([
      {
        $lookup: {
          from: 'comms',
          localField: '_id',
          foreignField: 'taskid',
          as: 'Taskcomm',
        },
      },
      { $unwind: '$Taskcomm' },
      {
        $lookup: {
          from: 'status',
          localField: '_id',
          foreignField: '_id',
          as: 'Status',
        },
      },
      { $unwind: '$Status' },
      { $match: { _id: req.params.taskid } },
      {
        $project: {
          title: 1,
          wordcount: 1,
          soft_deadline: 1,
          description: 1,
          Expert: '$Taskcomm.Expert',
          Manager: '$Taskcomm.Manager',
          TeamLead: '$Taskcomm.TeamLead',
          status: '$Status.status',
        },
      },
      {
        $match: {
          TeamLead: req.decoded.userId,
        },
      },
    ]);
    var userdetail = await Task.aggregate([
      {
        $lookup: {
          from: 'comms',
          localField: '_id',
          foreignField: 'taskid',
          as: 'Taskcomm',
        },
      },
      { $unwind: '$Taskcomm' },
      { $match: { _id: req.params.taskid } },
      {
        $project: {
          _id: 0,
          Admin: '$Taskcomm.Admin',
          Expert: '$Taskcomm.Expert',
          Manager: '$Taskcomm.Manager',
          TeamLead: '$Taskcomm.TeamLead',
        },
      },
      {
        $match: { TeamLead: req.decoded.userId },
      },
    ]);
    await User.populate(taskdetails, {
      select: 'name',
      path: 'Manager TeamLead Expert',
    });
    await User.populate(comment, {
      select: 'name',
      path: 'commentto commentby',
    });
    await User.populate(userdetail, {
      select: 'name',
      path: 'Admin Manager TeamLead Expert',
    });
    res.json({ task: taskdetails, comments: comment, userdetails: userdetail });
  } catch (e) {
    next(e);
  }
};

//update status details
exports.put_status_update = async (req, res, next) => {
  try {
    var updatestatus = await Status.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Completed',
      },
      { new: true }
    );
    res.status(200).send(updatestatus);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//task stats
exports.get_te_stats = async (req, res, next) => {
  try {
    var alltask = await Task.aggregate([
      {
        $lookup: {
          from: 'comms',
          localField: 'taskcomm',
          foreignField: '_id',
          as: 'comm',
        },
      },
      { $unwind: '$comm' },
      {
        $match: {
          deleted: { $eq: false },
        },
      },
      {
        $project: {
          title: 1,
          wordcount: 1,
          deadline: '$soft_deadline',
          status: '$status.status',
          teamlead: '$comm.TeamLead',
          expert: '$comm.Expert',
        },
      },
      {
        $match: {
          expert: req.decoded.userId,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$wordcount' },
          count: { $sum: 1 },
        },
      },
    ]);
    res.send(alltask);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

exports.get_te_profile = async (req, res, next) => {
  try {
    var singleemployee = await User.findById(req.decoded.userId);
    await User.populate(singleemployee, { select: 'name', path: 'assignedTo' });
    res.status(200).send(singleemployee);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

exports.get_te_effort = async (req, res, next) => {
  try {
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

  } catch (e) {

  }
}

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



exports.post_te_efforttask = async (req, res, next) => {
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
