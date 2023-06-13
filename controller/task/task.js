const Task = require('../../models/task');
const Taskfiles = require('../../models/briefupload');
const TaskOrder = require('../../models/order');
const Status = require('../../models/status');
const Payment = require('../../models/payment');
const Comment = require('../../models/comments');
const Taskcomm = require('../../models/comm');
const Notification = require('../../models/notification');
const User = require('../../models/user');
const jwt_decode = require('jwt-decode');
const ObjectId = require('mongoose').Types.ObjectId;
const { validationResult } = require('express-validator');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const { matchReqNSendNotification } = require('../../util/socket-io');

const sendNotificationForTask = async (type, payload, req) => {
  let actionEffectsToIds = await User.find({
    user_type: 'Employee',
    'employee.user_role': 'SuperAdmin',
  }).select('_id');
  actionEffectsToIds = actionEffectsToIds.filter(function (obj) {
    return String(obj._id) !== String(req.decoded.userId);
  });
  switch (type) {
    case 'taskCreation':
      {
        let title = `${payload.tasks.length} Task(s) created.`;
        let subTitle = `by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: 'Task',
          actionTakenById: req.decoded.userId,
          resourceId: payload.taskids,
          typeof: 'Create',
          actionEffectsToId: actionEffectsToIds,
          title: title,
          subTitle: subTitle,
          action: '/su/task/' + req.params.id,
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) {
          return String(el._id);
        });
        await NotificationCreate.save();
        matchReqNSendNotification(
          actionEffectsToIds,
          { title, subTitle, action: '/su/task/' + req.params.id },
          'taskCreation'
        );
      }
      break;
    case 'taskStatusUpdated':
      {
        let taskRelatedIds = await Taskcomm.findOne({
          taskid: req.params.id,
        }).select('Admin TeamLead Manager -_id');
        actionEffectsToIds = [
          ...actionEffectsToIds,
          ...Object.values(taskRelatedIds['_doc']).map((el) => {
            return { _id: ObjectId(el) };
          }),
        ];

        let title = `${req.params.id} status updated to ${payload}.`;
        let subTitle = `\n by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: 'Task',
          actionTakenById: req.decoded.userId,
          typeof: 'Status',
          resourceId: [req.params.id],
          actionEffectsToId: actionEffectsToIds,
          title: title,
          subTitle: subTitle,
          action: '/su/task/' + req.params.id,
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) {
          return String(el._id);
        });
        await NotificationCreate.save();
        matchReqNSendNotification(
          actionEffectsToIds,
          { title, subTitle, action: '/su/task/' + req.params.id },
          'taskStatusUpdated'
        );
      }
      break;
    case 'taskUpdated':
      {
        let taskRelatedIds = await Taskcomm.findOne({
          taskid: req.params.id,
        }).select('Admin Expert TeamLead Manager -_id');
        actionEffectsToIds = [
          ...actionEffectsToIds,
          ...Object.values(taskRelatedIds['_doc']).map((el) => {
            return { _id: ObjectId(el) };
          }),
        ];

        let title = `Task ${req.params.id} updated`;
        let subTitle = `\n by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: 'Task',
          actionTakenById: req.decoded.userId,
          typeof: 'Update',
          resourceId: [req.params.id],
          actionEffectsToId: actionEffectsToIds,
          title: title,
          subTitle: subTitle,
          action: '/su/task/' + req.params.id,
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) {
          return String(el._id);
        });
        await NotificationCreate.save();
        matchReqNSendNotification(
          actionEffectsToIds,
          { title, subTitle, action: '/su/task/' + req.params.id },
          'taskStatusUpdated'
        );
      }
      break;
    case 'taskDeleted':
      {
        let taskRelatedIds = await Taskcomm.findOne({
          taskid: req.params.id,
        }).select('Admin Expert TeamLead Manager -_id');
        actionEffectsToIds = [
          ...actionEffectsToIds,
          ...Object.values(taskRelatedIds['_doc']).map((el) => {
            return { _id: ObjectId(el) };
          }),
        ];

        let title = `Task ${req.params.id} Deleted`;
        let subTitle = `\n by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: 'Task',
          actionTakenById: req.decoded.userId,
          typeof: 'Delete',
          resourceId: [req.params.id],
          actionEffectsToId: actionEffectsToIds,
          title: title,
          subTitle: subTitle,
          action: '/su/task/' + req.params.id,
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) {
          return String(el._id);
        });
        await NotificationCreate.save();
        matchReqNSendNotification(
          actionEffectsToIds,
          { title, subTitle, action: '/su/task/' + req.params.id },
          'taskStatusUpdated'
        );
      }
      break;

    default:
      break;
  }
};

//create task

exports.post_task_create = async function (req, res, next) {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return res.json({
      msg: 'error',
      errors,
    });
  }
  const { taskDetail, clientData } = JSON.parse(req.body.data);
  let tasksCreate = [];
  let tasksCreateIds = {
    statusNpayment: [],
    taskcomm: [],
  };
  clientData.forEach((val) => {
    tasksCreate.push({
      ...taskDetail,
      createdby: req.decoded.userId,
      title: val.title,
      client: val.client,
    });
  });
  try {
    const createTask = await Task.insertMany(tasksCreate);
    createTask.forEach((val) => {
      tasksCreateIds.statusNpayment.push({
        _id: val._id,
      });
      tasksCreateIds.taskcomm.push({
        taskid: val._id,
      });
    });
    if (taskDetail.orderId) {
      const getOrderDetails = await TaskOrder.findOne({
        _id: ObjectId(taskDetail.orderId),
      });
      if (getOrderDetails.orderFiles && getOrderDetails.orderFiles.length > 0) {
        let prepareTaskFiles = [];
        getOrderDetails.orderFiles.forEach((e) => {
          prepareTaskFiles.push({
            ...e._doc,
            taskid: createTask[0]._id,
          });
        });
        await TaskOrder.updateOne(
          { _id: ObjectId(taskDetail.orderId) },
          {
            $set: {
              reqActionBy: {
                user: req.decoded.userId,
                actionAt: new Date(),
                actionType: 'Approved',
              },
            },
          }
        );
        await Taskfiles.insertMany(prepareTaskFiles);
      }
    }
    const status = await Status.insertMany(tasksCreateIds.statusNpayment);
    const payment = await Payment.insertMany(tasksCreateIds.statusNpayment);
    const taskcomm = await Taskcomm.insertMany(tasksCreateIds.taskcomm);
    var updatetaskcomm = [];
    for (let i = 0; i < tasksCreateIds.statusNpayment.length; i++) {
      let pos = taskcomm
        .map(function (e) {
          return e.taskid;
        })
        .indexOf(tasksCreateIds.statusNpayment[i]._id);
      const resp = await Task.findByIdAndUpdate(
        tasksCreateIds.statusNpayment[i]._id,
        { taskcomm: taskcomm[pos]._id },
        { new: true }
      );
      updatetaskcomm.push(resp);
    }
    await sendNotificationForTask(
      'taskCreation',
      { tasks: createTask, taskids: tasksCreateIds.statusNpayment },
      req
    );

    res.status(201).send({
      status: 'created',
      task: tasksCreateIds.statusNpayment,
      payment: payment,
      status: status,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
  // const task = new Task({
  //   title: req.body.title,
  //   wordcount: req.body.wordcount,
  //   soft_deadline: req.body.soft_deadline,
  //   hard_deadline: req.body.hard_deadline,
  //   client: req.body.client,
  //   description: req.body.description,
  //   createdby: req.decoded.userId
  // });
  // try {
  // var tasksave = await task.save();
  // const status = new Status({
  //   _id: tasksave._id
  // });
  // const payment = new Payment({
  //   _id: tasksave._id
  // });
  // const taskcomm = new Taskcomm({
  //   taskid: tasksave._id
  // });
  //   var statussave = await status.save();
  //   var paymentsave = await payment.save();
  //   var taskdetails = await taskcomm.save();
  //   var updatetaskcomm = await Task.findByIdAndUpdate(
  //     tasksave._id,
  //     { taskcomm: taskdetails._id },
  //     { new: true }
  //   );
  //   res.status(201).send({
  //     status: "created",
  //     task: updatetaskcomm,
  //     payment: paymentsave,
  //     status: statussave
  //   });
  // } catch (e) {
  //   res.status(400).send({ error: e.message });
  // }
};

exports.post_bulk_task_create = async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, '../../', req.file.path);
    // const wsData = fs.readFileSync(filePath)
    const wb = xlsx.readFile(filePath, {
      cellDates: true,
    });
    const ws = wb.Sheets['Sheet1'];
    const data = xlsx.utils.sheet_to_json(ws);
    var result = data
      .filter(function (el) {
        if (
          !!el.title &&
          !!el.soft_deadline &&
          el.hard_deadline &&
          !!el.client &&
          !!el.wordcount
        ) {
          return true;
        }
        return false;
      })
      .map(function (el) {
        var o = Object.assign({}, el);
        o = { ...o, createdby: req.decoded.userId };
        if (!el.description) {
          o = { ...o, description: '' };
        }
        return o;
      });
    fs.unlink(filePath, (err) => {
      if (err) {
        throw 'Some Error occured deleting the file';
      }
    });
    if (result.length > 0 && !result) {
      res.status(500).send({
        message: 'Error parsing the cells from the files',
      });
    }
    let tasksCreateIds = {
      statusNpayment: [],
      bulkTaskCreateTask: [],
      taskcomm: [],
    };
    const createTask = await Task.insertMany(result);
    createTask.forEach((val) => {
      tasksCreateIds.bulkTaskCreateTask.push(val._id);
      tasksCreateIds.statusNpayment.push({
        _id: val._id,
      });
      tasksCreateIds.taskcomm.push({
        taskid: val._id,
      });
    });
    const userTasks = await User.update(
      {
        _id: req.decoded.userId,
      },
      {
        $push: {
          bulkDataCreated: {
            filename: req.file.originalname,
            taskIds: tasksCreateIds.bulkTaskCreateTask,
          },
        },
      }
    );
    const status = await Status.insertMany(tasksCreateIds.statusNpayment);
    const payment = await Payment.insertMany(tasksCreateIds.statusNpayment);
    const taskcomm = await Taskcomm.insertMany(tasksCreateIds.taskcomm);
    var updatetaskcomm = [];
    for (let i = 0; i < tasksCreateIds.statusNpayment.length; i++) {
      let pos = taskcomm
        .map(function (e) {
          return e.taskid;
        })
        .indexOf(tasksCreateIds.statusNpayment[i]._id);
      const resp = await Task.findByIdAndUpdate(
        tasksCreateIds.statusNpayment[i]._id,
        { taskcomm: taskcomm[pos]._id },
        { new: true }
      );
      updatetaskcomm.push(resp);
    }
    res.status(201).send({
      task: tasksCreateIds.statusNpayment,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
  // res.send(result)
};

exports.get_bulk_task = async (req, res, next) => {
  const { bulkDataCreated } = await User.findById(req.decoded.userId);
  res.send(bulkDataCreated);
};


exports.getCalendarEvents = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const tasks = await Task.find({
      hard_deadline: { $gte: startOfMonth },
      deleted: false
    })
      .select('title hard_deadline wordcount');

    const data = [];
    const currentDate = new Date(startOfMonth);
    const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    while (currentDate <= lastDate) {
      const filteredTasks = tasks.filter(task => {
        return task.hard_deadline.getFullYear() === currentDate.getFullYear() &&
          task.hard_deadline.getMonth() === currentDate.getMonth() &&
          task.hard_deadline.getDate() === currentDate.getDate();
      });

      let totalWordCount = 0;
      filteredTasks.forEach(task => {
        totalWordCount += task.wordcount;
      });

      data.push({
        title: `Total: ${totalWordCount}`,
        allDay: true,
        description: `Word count of ${currentDate.toLocaleDateString()}: ${totalWordCount}`,
        className: "fc-event-danger",
        key: 1,
        start: currentDate.toISOString().slice(0, 10),
        interactive: false
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    tasks.forEach(task => {
      data.push({
        title: task._id,
        key: 2,
        allDay: true,
        url: `/su/task/${task._id}`,
        start: task.hard_deadline.toISOString().slice(0, 10),
        description: task.title,
        className: "fc-event-brand"
      });
    });

    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// mark task as completed or delivered
exports.put_status_update = async (req, res, next) => {
  const { type } = req.body;
  console.log(type)
  // if(type="delivered"){

  // }
  // else{
  let markStatusAs = type === 'complete' ? 'Completed' : 'Delivered';
  try {

    if (type === 'unassigned') {
      var updatestatus = await Status.findByIdAndUpdate(
        req.params.id,
        {
          status: "Unassigned",
        },
        { new: true }
      );
    }
    else {
      var updatestatus = await Status.findByIdAndUpdate(
        req.params.id,
        {
          status: markStatusAs,
        },
        { new: true }
      );
      if (type === 'complete') {
        const getPrevTaskComm = await Taskcomm.findOne({ taskid: req.params.id });
        await Taskcomm.findOneAndUpdate(
          {
            taskid: req.params.id,
          },
          {
            $push: {
              iterations: {
                Manager: getPrevTaskComm.Manager,
                TeamLead: getPrevTaskComm.TeamLead,
                Expert: getPrevTaskComm.Expert,
              },
            },
            $set: { Admin: null, Manager: null, TeamLead: null, Expert: null },
          }
        );
      }
    }

    await sendNotificationForTask('taskStatusUpdated', markStatusAs, req);
    res.status(200).send(updatestatus);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view task within 1 week with status not equal to delivered and completed
exports.get_task_week = async (req, res, next) => {
  var date = new Date();
  date.setDate(date.getDate() + 7);
  try {
    var alltask = await Task.aggregate([
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
      {
        $match: {
          $and: [
            { soft_deadline: { $lt: date } },
            { status: { $ne: 'Delivered' } },
            { status: { $ne: 'Completed' } },
          ],
        },
      },
    ]);
    res.status(200).send({
      status: 'OK',
      data: alltask,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.get_task_ultimate = async (req, res, next) => {
  try {
    var { task, status, dateRange } = req.query;
    let startDate, endDate, dateQuery;
    task = Number(task);
    status = Number(status);
    if (task === NaN || task < 199 || task > 205) {
      throw Error('Please enter a valid task filter.');
    }
    if (status) {
      if (task === 202 || task === 203) {
        throw new Error('Status filters not available for these Task Types');
      }
      if (status < 100 || status > 107) {
        throw new Error('Please enter a valid staus filter.');
      }
    }
    if (!!dateRange) {
      let breakRange = dateRange.split('|');
      startDate = new Date(breakRange[0]);
      endDate = new Date(breakRange[1]);
      dateQuery = {
        $match: {
          soft_deadline: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      };
    }
    var date = new Date();
    var aggregateQuery = [
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
      101: { $match: { status: { $eq: 'Unassigned' } } },
      102: { $match: { status: { $eq: 'Assigned to Admin' } } },
      103: { $match: { status: { $eq: 'Assigned to Manager' } } },
      104: { $match: { status: { $eq: 'Assigned to TeamLead' } } },
      105: { $match: { status: { $eq: 'Running' } } },
      106: { $match: { status: { $eq: 'Quality Check' } } },
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
    if (!!dateRange) {
      aggregateQuery.push(dateQuery);
    }
    aggregateQuery.push({ $sort: { soft_deadline: -1 } });
    var alltask = await Task.aggregate(aggregateQuery);
    res.status(200).send({
      status: 'OK',
      data: alltask,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

//view all task with status not equal to delivered and completed
exports.get_task_all = async (req, res, next) => {
  var date = new Date();
  date.setDate(date.getDate() + 7);
  try {
    var alltask = await Task.aggregate([
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
      {
        $match: {
          $and: [
            { status: { $ne: 'Delivered' } },
            { status: { $ne: 'Completed' } },
          ],
        },
      },
    ]);
    res.status(200).send({
      status: 'OK',
      data: alltask,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

//view all task which are in progress
exports.get_task_progress = async (req, res, next) => {
  try {
    var alltask = await Task.aggregate([
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
      {
        $match: {
          $and: [
            { status: { $ne: 'Unassigned' } },
            { status: { $ne: 'Delivered' } },
            { status: { $ne: 'Completed' } },
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
      res.status(200).send({
        status: 'OK',
        data: alltask,
      });
    }
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// view all task which are unassigned.
exports.get_task_unassigned = async (req, res, next) => {
  try {
    var alltask = await Task.aggregate([
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
      {
        $match: {
          status: { $eq: 'Unassigned' },
        },
      },
    ]);
    if (req.query.count == 'yes') {
      var lengthtask = await alltask.length;
      res.status(200).send({
        count: lengthtask,
      });
    } else {
      res.status(200).send({
        status: 'OK',
        data: alltask,
      });
    }
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

//view all task
exports.get_task_full = async (req, res, next) => {
  var date = new Date();
  date.setDate(date.getDate() + 7);
  try {
    var alltask = await Task.aggregate([
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
    ]);
    res.status(200).send({
      status: 'OK',
      data: alltask,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// Get All task within a week range with Before and After week Functionality
exports.get_task_by_week = async (req, res, next) => {
  const { range } = req.query;
  try {
    if (!range) {
      throw Error('Please send the range you want tasks in');
    }
    let curr = new Date(); // get current date
    let first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6

    let firstDay = new Date(curr.setDate(first));
    let lastDay = new Date(curr.setDate(last));
    let oFirstDay;
    let oLastDay;
    if (range !== 'current' && !isNaN(Number(range))) {
      if (Number(range) > 0) {
        first = first + 7 * Number(range);
        last = first + 6;
      } else {
        last = last + 7 * Number(range);
        first = last - 6;
      }
      oFirstDay = new Date(firstDay.setDate(first)).toUTCString();
      oLastDay = new Date(lastDay.setDate(last)).toUTCString();
    }
    const firstDayDe = range == 'current' ? firstDay.toUTCString() : oFirstDay;
    const lastDayDe = range == 'current' ? lastDay.toUTCString() : oLastDay;

    const response = await Task.aggregate([
      {
        $match: {
          soft_deadline: {
            $gte: new Date(firstDayDe),
            $lte: new Date(lastDayDe),
          },
        },
      },
      { $sort: { soft_deadline: 1 } },
      {
        $project: {
          title: 1,
          soft_deadline: 1,
        },
      },
      {
        $lookup: {
          from: 'status',
          foreignField: '_id',
          localField: '_id',
          as: 'status',
        },
      },
      {
        $unwind: '$status',
      },
      {
        $project: {
          title: 1,
          soft_deadline: 1,
          status: '$status.status',
        },
      },
    ]);
    res.json({
      data: response,
      firstDay: firstDayDe,
      lastDay: lastDayDe,
    });
  } catch (error) {
    res.status(404).send({
      error: error.message,
    });
  }
};

//view delayed task
exports.get_task_delayed = async (req, res, next) => {
  var date = new Date();
  try {
    var alltask = await Task.aggregate([
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
      {
        $match: {
          $and: [
            { soft_deadline: { $lt: date } },
            { status: { $ne: 'Delivered' } },
            { status: { $ne: 'Completed' } },
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
      res.status(200).send({
        status: 'OK',
        data: alltask,
      });
    }
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

//view task with status and payment
exports.get_task_client = async (req, res, next) => {
  const { month, year } = req.query;
  try {
    var taskPipeline = [
      {
        $match: {
          deleted: false,
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
      { $unwind: '$statusId' },
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: '_id',
          as: 'paymentId',
        },
      },
      { $unwind: '$paymentId' },
      {
        $match: {
          client: ObjectId(req.params.clientid),
        },
      },
      {
        $project: {
          soft_deadline: 1,
          month: { $month: '$soft_deadline' },
          year: { $year: '$soft_deadline' },
          title: 1,
          wordcount: 1,
          client: 1,
          deleted: 1,
          createdby: 1,
          status: '$statusId.status',
          currency: {
            $cond: {
              if: '$paymentId.currency',
              then: '$paymentId.currency',
              else: 'N/A',
            }
          },
          budget: {
            $cond: {
              if: '$paymentId.budget',
              then: '$paymentId.budget',
              else: 'N/A',
            },
          },
          paid: {
            $cond: {
              if: '$paymentId.amount_paid',
              then: '$paymentId.amount_paid',
              else: {
                $cond: {
                  if: {
                    $eq: ['$paymentId.amount_paid', 0],
                  },
                  then: 0,
                  else: 'N/A',
                },
              },
            },
          },

          paymentstatus: {
            $cond: {
              if: '$paymentId.budget',
              then: {
                $cond: {
                  if: { $eq: ['$paymentId.amount_paid', 0] },
                  then: 'Unpaid',
                  else: {
                    $cond: {
                      if: {
                        $eq: ['$paymentId.amount_paid', '$paymentId.budget'],
                      },
                      then: 'Paid',
                      else: 'Partial',
                    },
                  },
                },
              },
              else: 'N/A',
            },
          },
        },
      },
      { $sort: { soft_deadline: -1 } },
    ];
    if (!!month && !!year) {
      taskPipeline.push({
        $match: {
          month: Number(month),
          year: Number(year),
        },
      });
    }
    var alltask = await Task.aggregate(taskPipeline);
    await User.populate(alltask, { select: 'name', path: 'createdby' });
    res.status(200).send({
      status: 'OK',
      data: alltask,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

//view single task details
exports.get_task_single = async (req, res, next) => {
  try {
    var singletask = await Task.findById(req.params.id).populate({
      path: 'createdby client',
      select: 'name email assignedTo',
    });
    await User.populate(singletask, {
      path: 'client.assignedTo',
      select: 'name',
    });
    var singlestatus = await Status.findById(req.params.id);
    var singlepayment = await Payment.findById(req.params.id);
    var singlecomm = await Taskcomm.findOne({ taskid: req.params.id })
      .populate({
        path: 'tasklogs.assignedby tasklogs.assignedto Admin Expert TeamLead',
        select: 'name email user_type employee client phone',
      })
      .populate({
        path: 'tasklogs.fileIds',
        select: '_id uploadpath files',
      })
      .sort({
        createdAt: -1,
      });
    var allComment = await Comment.find({ taskid: req.params.id }).populate({
      path: 'commentby commentto',
      select: 'name email',
    });
    res.status(200).send({
      task: singletask,
      payment: singlepayment,
      status: singlestatus,
      taskcomm: singlecomm,
      comments: allComment,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
};

exports.test = async (req, res, next) => {
  // try {
  //   const response =  await Task.updateMany(
  //     {__v : 0},
  //     { deleted : false,
  //   })
  //   res.json(response)
  // } catch (error) {
  //   res.json ({
  //     error : error
  //   })
  // }
  try {
    const response = await User.updateMany(
      { __v: 0 },
      {
        createdby: '5dbfd06e4384431150c698d8',
        assignedTo: '5dbfd06e4384431150c698d8',
      }
    );
    res.json(response);
  } catch (error) {
    res.json({
      error: error,
    });
  }
  // if (req.body.count) {
  //   res.send("found");
  // } else {
  //   res.send("not found");
  // }
};

//update task details
exports.put_task_update = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.json({
        msg: 'error',
        errors,
      });
    }
    var updatetask = await Task.update(
      { _id: req.params.id },
      {
        title: req.body.title,
        wordcount: req.body.wordcount,
        soft_deadline: req.body.soft_deadline,
        hard_deadline: req.body.hard_deadline,
        client: req.body.client,
        description: req.body.description,
      }
    );
    await sendNotificationForTask('taskUpdated', null, req);
    res.status(200).send(updatetask);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

// payment sheet with status, client
exports.get_payment_status_task = async (req, res, next) => {
  try {
    var tasksheet = await Task.aggregate([
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: '_id',
          as: 'Payment',
        },
      },
      { $unwind: '$Payment' },
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
          soft_deadline: 1,
          hard_deadline: 1,
          wordcount: 1,
          client: 1,
          status: '$Status.status',
          Payment: {
            $cond: {
              if: '$Payment.budget',
              then: {
                $cond: {
                  if: { $eq: ['$Payment.amount_paid', 0] },
                  then: 'Unpaid',
                  else: {
                    $cond: {
                      if: {
                        $eq: ['$Payment.amount_paid', '$Payment.budget'],
                      },
                      then: 'Paid',
                      else: 'Partial',
                    },
                  },
                },
              },
              else: 'N/A',
            },
          },
        },
      },
      { $match: { Payment: { $ne: 'Paid' } } },
    ]);
    await User.populate(tasksheet, { select: 'name', path: 'client' });
    res.json({
      status: 'OK',
      data: tasksheet,
    });
  } catch (e) { }
};

//payment according to client
exports.get_payment_client = async (req, res, next) => {
  try {
    const month = req.query.month ? req.query.month : undefined;
    const year = req.query.year ? req.query.year : undefined;
    // const conversions = await axios.get("https://api.exchangerate-api.com/v4/latest/INR")
    if (month === undefined || year === undefined) {
      var results = await User.aggregate([
        {
          $match: {
            user_type: 'Client',
          },
        },
        {
          $lookup: {
            from: 'tasks',
            localField: '_id',
            foreignField: 'client',
            as: 'ClientTasks',
          },
        },
        { $unwind: '$ClientTasks' },
        {
          $project: {
            email: 1,
            name: 1,
            taskId: '$ClientTasks._id',
          },
        },
        {
          $lookup: {
            from: 'payments',
            localField: 'taskId',
            foreignField: '_id',
            as: 'taskPayments',
          },
        },
        { $unwind: '$taskPayments' },
        {
          $project: {
            email: 1,
            name: 1,
            taskId: 1,
            currency: '$taskPayments.currency',
            amount_paid: '$taskPayments.amount_paid',
            amount_task: '$taskPayments.budget',
          },
        },
        {
          $group: {
            _id: '$_id',
            email: { $first: '$email' },
            name: { $first: '$name' },
            paid: {
              $push: {
                $concat: [{ $toString: '$amount_paid' }, ' ', '$currency', ' '],
              },
            },
            amount: {
              $push: {
                $concat: [{ $toString: '$amount_task' }, ' ', '$currency', ' '],
              },
            },
          },
        },
      ]);
    } else {
      var results = await User.aggregate([
        {
          $match: {
            user_type: 'Client',
          },
        },
        {
          $lookup: {
            from: 'tasks',
            localField: '_id',
            foreignField: 'client',
            as: 'ClientTasks',
          },
        },
        { $unwind: '$ClientTasks' },
        {
          $project: {
            email: 1,
            name: 1,
            taskId: '$ClientTasks._id',
            month: { $month: '$ClientTasks.hard_deadline' },
            year: { $year: '$ClientTasks.hard_deadline' },
          },
        },
        {
          $match: {
            month: Number(month),
            year: Number(year),
          },
        },
        {
          $lookup: {
            from: 'payments',
            localField: 'taskId',
            foreignField: '_id',
            as: 'taskPayments',
          },
        },
        { $unwind: '$taskPayments' },
        {
          $project: {
            email: 1,
            name: 1,
            taskId: 1,
            currency: '$taskPayments.currency',
            amount_paid: '$taskPayments.amount_paid',
          },
        },
        {
          $group: {
            _id: '$_id',
            email: { $first: '$email' },
            name: { $first: '$name' },
            taskIdAmount: {
              $push: {
                $concat: [{ $toString: '$amount_paid' }, ' ', '$currency', ' '],
              },
            },
          },
        },
      ]);
    }
    const inrRates = {
      AUD: 0.021,
      GBP: 0.01,
      NZD: 0.022,
      USD: 0.014,
      INR: 1,
    };
    results.map((client) => {
      let total = [];
      let total1 = [];
      total = client.paid.map((amount) => {
        if (amount !== null) {
          let amountSplit = amount.split(' ');
          var fixedamount = parseFloat(
            Number(amountSplit[0]) / inrRates[amountSplit[1]]
          ).toFixed(2);
          return Math.round(fixedamount);
        }
        return 0;
      });
      total1 = client.amount.map((amount) => {
        if (amount !== null) {
          let amountSplit = amount.split(' ');
          var fixamount = parseFloat(
            Number(amountSplit[0]) / inrRates[amountSplit[1]]
          ).toFixed(2);
          return Math.round(fixamount);
        }
        return 0;
      });
      delete client.paid;
      delete client.amount;
      var paidAmount = total.reduce((a, b) => Number(a) + Number(b), 0);
      var taskAmount = total1.reduce((a, b) => Number(a) + Number(b), 0);
      client['paidAmount'] = paidAmount;
      client['taskAmount'] = taskAmount;
    });
    var sortedResults = results.sort(function (a, b) {
      return b.paidAmount - a.paidAmount;
    });
    const result = sortedResults.filter(
      (data) => data.taskAmount != data.paidAmount
    );
    res.json({ status: 'ok', data: result });
  } catch (error) {
    next(error);
  }
};

//hard delete task
exports.delete_bulk_task_hard = async (req, res, next) => {
  try {
    var { bulkDataCreated } = await User.findOne({ _id: req.decoded.userId });
    var newBulkDataCreated = [];
    for (let i = 0; i < bulkDataCreated.length; i++) {
      // console.log(
      //   bulkDataCreated[i]._id.equals(ObjectId(req.params.bulkId)),
      //   ObjectId(req.params.bulkId),
      //   bulkDataCreated[i]._id
      // );
      if (bulkDataCreated[i]._id.equals(ObjectId(req.params.bulkId))) {
        var deletedtasks = await Task.deleteMany({
          _id: { $in: bulkDataCreated[i].taskIds },
        });
        var deletepayment = await Payment.deleteMany({
          _id: { $in: bulkDataCreated[i].taskIds },
        });
        var deletetstatus = await Status.deleteMany({
          _id: { $in: bulkDataCreated[i].taskIds },
        });
        var deletetcomms = await Taskcomm.deleteMany({
          taskid: { $in: bulkDataCreated[i].taskIds },
        });
      } else {
        newBulkDataCreated.push(bulkDataCreated[i]);
      }
    }
    if (newBulkDataCreated.length === bulkDataCreated.length) {
      throw new Error('No Bulk Task created with this Id found.');
    }
    const updateUserBulkCreate = await User.updateOne(
      { _id: req.decoded.userId },
      {
        $set: {
          bulkDataCreated: newBulkDataCreated,
        },
      }
    );
    res.status(200).send('Tasks Deleted permanently');
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.delete_task_hard = async (req, res, next) => {
  try {
    var deletetask = await Task.findByIdAndRemove(req.params.id);
    var deletepayment = await Payment.findByIdAndRemove(req.params.id);
    var deletetstatus = await Status.findByIdAndRemove(req.params.id);
    var deletetcomms = await Taskcomm.findOneAndRemove({
      taskid: req.params.id,
    });
    res.status(200).send('Task Deleted permanently');
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

//soft delete client
exports.delete_task_soft = async (req, res, next) => {
  try {
    var deletetask = await Task.findByIdAndUpdate(req.params.id, {
      deleted: true,
    });
    await sendNotificationForTask('taskDeleted', null, req);
    res.status(200).send('Task Deleted');
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};


exports.get_su_payment_task_filters = async (req, res, next) => {
  try {
    let match = {
      deleted: false,
    };

    // Check if month and year query parameters are present
    const { month, year } = req.query;
    if (month && year) {
      // Set the date filter based on the month and year
      match.hard_deadline = {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      };
    }

    var results = await Task.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: '_id',
          as: 'payment',
        },
      },
      { $unwind: '$payment' },
      {
        $lookup: {
          from: 'users',
          localField: 'client',
          foreignField: '_id',
          as: 'client',
        }
      },
      { $unwind: '$client' },
      {
        $lookup: {
          from: 'users',
          localField: 'client.assignedTo',
          foreignField: '_id',
          as: 'BDA',
        }
      },
      {
        $unwind: '$BDA',
      },
      {
        $project: {
          _id: 1,
          title: 1,
          wordcount: 1,
          hard_deadline: 1,
          client: {
            _id: '$client._id',
            name: '$client.name',
          },
          BDA: {
            _id: '$BDA._id',
            name: '$BDA.name',
          },
          amount: `$payment.budget`,
          paid: `$payment.amount_paid`,
          currency: `$payment.currency`
        },
      }]);

    res.status(200).send({ status: 'OK', data: results });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
}