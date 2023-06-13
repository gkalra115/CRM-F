const Task = require('../../models/task');
const Status = require('../../models/status');
const Payment = require('../../models/payment');
const Comment = require('../../models/comments');
const Taskcomm = require('../../models/comm');
const User = require('../../models/user');
const jwt_decode = require('jwt-decode');
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
          softdeadline: '$soft_deadline',
          harddeadline: '$hard_deadline',
          status: '$status.status',
          client: '$client',
          manager: '$comm.Manager',
          teamlead: '$comm.TeamLead',
          expert: '$comm.Expert',
        },
      },
      {
        $match: {
          $and: [
            { manager: req.decoded.userId },
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
        path: 'teamlead manager expert client',
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
    var teamleadtask = await Task.aggregate([
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
      {
        $project: {
          title: 1,
          wordcount: 1,
          soft_deadline: 1,
          Expert: '$Taskcomm.Expert',
          Manager: '$Taskcomm.Manager',
          TeamLead: '$Taskcomm.TeamLead',
          status: '$Status.status',
        },
      },
      {
        $match: {
          $and: [
            { Manager: req.decoded.userId },
            { status: { $ne: 'Delivered' } },
            { status: { $ne: 'Completed' } },
          ],
        },
      },
    ]);
    if (req.query.count == 'yes') {
      var lengthtask = await teamleadtask.length;
      res.status(200).send({
        count: lengthtask,
      });
    } else {
      await User.populate(teamleadtask, {
        select: 'name',
        path: 'Manager TeamLead Expert',
      });
      res.send({ status: 'OK', data: teamleadtask });
    }
  } catch (e) {
    console.log(e);
  }
};

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
          manager: req.decoded.userId,
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

exports.get_task_ultimate = async (req, res, next) => {
  try {
    var { task, status } = req.query;
    task = Number(task);
    status = Number(status);
    if (task === NaN || task < 199 || task > 205) {
      throw Error('Please enter a valid task filter.');
    }
    if (status) {
      if (task === 202 || task === 203) {
        throw new Error('Status filters not available for these Task Types');
      }
      if (status < 100 || status > 105) {
        throw new Error('Please enter a valid staus filter.');
      }
    }
    var date = new Date();
    var aggregateQuery = [
      {
        $lookup: {
          from: 'tasks',
          localField: 'taskid',
          foreignField: '_id',
          as: 'taskCommRel',
        },
      },
      { $match: { Manager: req.decoded.userId.toString() } },
      { $unwind: '$taskCommRel' },
      {
        $project: {
          _id: 0,
          _id: '$taskCommRel._id',
          assignedto: '$taskCommRel.assignedto',
          title: '$taskCommRel.title',
          wordcount: '$taskCommRel.wordcount',
          soft_deadline: '$taskCommRel.soft_deadline',
          hard_deadline: '$taskCommRel.hard_deadline',
          client: '$taskCommRel.client',
          description: '$taskCommRel.description',
          createdby: '$taskCommRel.createdby',
          createdAt: '$taskCommRel.createdAt',
          updatedAt: '$taskCommRel.updatedAt',
          __v: '$taskCommRel.__v',
          deleted: '$taskCommRel.deleted',
        },
      },
      {
        $lookup: {
          from: 'status',
          localField: '_id',
          foreignField: '_id',
          as: 'statusId',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'client',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdby',
          foreignField: '_id',
          as: 'createdby',
        },
      },
      { $unwind: '$statusId' },
      { $unwind: '$client' },
      { $unwind: '$createdby' },
      {
        $match: {
          deleted: { $eq: false },
        },
      },
      {
        $project: {
          title: 1,
          soft_deadline: 1,
          hard_deadline: 1,
          wordcount: 1,
          status: '$statusId.status',
          client: '$client.name',
          createdby: '$createdby.name',
        },
      },
    ];
    date.setDate(date.getDate() + 7);
    var statusWise = {
      101: { $match: { status: { $eq: 'Assigned to Manager' } } },
      102: { $match: { status: { $eq: 'Assigned to TeamLead' } } },
      103: { $match: { status: { $eq: 'Running' } } },
      104: { $match: { status: { $eq: 'Quality Check' } } },
    };
    var taskWise = {
      200: {
        $match: {
          $and: [
            { status: { $ne: 'Delivered' } },
            { status: { $ne: 'Completed' } },
          ],
        },
      },
      201: {
        $match: {
          $and: [
            { soft_deadline: { $lt: date } },
            { status: { $ne: 'Delivered' } },
            { status: { $ne: 'Completed' } },
          ],
        },
      },
      202: {
        $match: { status: { $eq: 'Completed' } },
      },
      203: {
        $match: {
          $and: [{ status: { $eq: 'Delivered' } }],
        },
      },
      204: {
        $match: {
          $and: [
            { soft_deadline: { $lt: new Date() } },
            { status: { $ne: 'Delivered' } },
            { status: { $ne: 'Completed' } },
          ],
        },
      },
    };
    aggregateQuery.push(taskWise[task]);
    if (status) {
      aggregateQuery.push(statusWise[status]);
    }
    var alltask = await Taskcomm.aggregate(aggregateQuery);
    res.status(200).send({
      status: 'OK',
      data: alltask,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
  // try {
  //     const alltask = await Task.find({})
  // alltask.forEach(async function(x) {
  //     await Task.findByIdAndUpdate({_id: x._id},
  //          {$set: {
  //             createdAt: x.createdAt,
  //             }
  //         });
  // });
  // } catch (error) {
  //     next(error)
  // }
};

// Single task page

exports.get_mn_single_task = async (req, res, next) => {
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
          hard_deadline: 1,
          client: 1,
          description: 1,
          Expert: '$Taskcomm.Expert',
          Manager: '$Taskcomm.Manager',
          TeamLead: '$Taskcomm.TeamLead',
          status: '$Status.status',
        },
      },
      {
        $match: {
          Manager: req.decoded.userId,
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
        $match: { Manager: req.decoded.userId },
      },
    ]);
    await User.populate(taskdetails, {
      select: 'name',
      path: 'Manager TeamLead Expert client',
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
