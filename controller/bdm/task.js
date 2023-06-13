const Task = require('../../models/task');
const Status = require('../../models/status');
const Payment = require('../../models/payment');
const Comment = require('../../models/comments');
const Taskcomm = require('../../models/comm');
const User = require('../../models/user');
const jwt_decode = require('jwt-decode');
const ObjectId = require('mongoose').Types.ObjectId;

//create task
exports.post_task_create = async function (req, res, next) {
  const task = new Task({
    title: req.body.title,
    wordcount: req.body.wordcount,
    soft_deadline: req.body.soft_deadline,
    hard_deadline: req.body.hard_deadline,
    client: req.body.client,
    description: req.body.description,
    createdby: req.decoded.userId,
  });
  try {
    var tasksave = await task.save();
    const status = new Status({
      _id: tasksave._id,
    });
    const payment = new Payment({
      _id: tasksave._id,
    });
    const taskcomm = new Taskcomm({
      taskid: tasksave._id,
      BDM: req.decoded.userId,
    });
    var statussave = await status.save();
    var paymentsave = await payment.save();
    var taskdetails = await taskcomm.save();
    var updatetaskcomm = await Task.findByIdAndUpdate(
      tasksave._id,
      { taskcomm: taskdetails._id },
      { new: true }
    );

    res.status(201).send({
      status: 'created',
      task: updatetaskcomm,
      payment: paymentsave,
      status: statussave,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
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
      if (status < 100 || status > 107) {
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
      { $unwind: '$taskCommRel' },
      {
        $match: {
          BDM: req.decoded.userId,
        },
      },
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

exports.get_sales_records = async (req, res, next) => {
  if (req.query.month == null) {
    var financevalue = await Task.aggregate([
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
          localField: '_id',
          foreignField: 'taskid',
          as: 'comms',
        },
      },
      { $unwind: '$status' },
      { $unwind: '$comms' },
      {
        $match: {
          deleted: { $eq: false },
          'comms.BDM': req.decoded.userId,
        },
      },
      {
        $project: {
          month: { $month: '$hard_deadline' },
          year: { $year: '$hard_deadline' },
          wordcount: 1,
          status: '$status.status',
        },
      },
      {
        $group: {
          _id: '$status',
          wordcount: {
            $sum: '$wordcount',
          },
          totaltask: { $sum: 1 },
        },
      },
    ]);
  } else {
    const month = req.query.month;
    const year = req.query.year;
    var financevalue = await Task.aggregate([
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
          localField: '_id',
          foreignField: 'taskid',
          as: 'comms',
        },
      },
      { $unwind: '$status' },
      { $unwind: '$comms' },
      {
        $match: {
          deleted: { $eq: false },
          'comms.BDM': req.decoded.userId,
        },
      },
      {
        $project: {
          month: { $month: '$hard_deadline' },
          year: { $year: '$hard_deadline' },
          wordcount: 1,
          status: '$status.status',
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
          _id: '$status',
          wordcount: {
            $sum: '$wordcount',
          },
          totaltask: { $sum: 1 },
        },
      },
    ]);
  }

  res.json(financevalue);
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
          from: 'comms',
          localField: '_id',
          foreignField: 'taskid',
          as: 'commsId',
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
          'commsId.BDM': String(req.decoded.userId),
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
          from: 'comms',
          localField: '_id',
          foreignField: 'taskid',
          as: 'commId',
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
      { $unwind: '$commId' },
      { $unwind: '$client' },
      { $unwind: '$createdby' },
      {
        $match: {
          deleted: { $eq: false },
          'commId.BDM': String(req.decoded.userId),
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
    console.log(e);
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
          from: 'comms',
          localField: '_id',
          foreignField: 'taskid',
          as: 'commId',
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
      { $unwind: '$commId' },
      { $unwind: '$client' },
      { $unwind: '$createdby' },
      {
        $match: {
          deleted: { $eq: false },
          'commId.BDM': String(req.decoded.userId),
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
          from: 'comms',
          localField: '_id',
          foreignField: 'taskid',
          as: 'commsId',
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
          'commsId.BDM': String(req.decoded.userId),
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
          from: 'comms',
          localField: '_id',
          foreignField: 'taskid',
          as: 'commId',
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
      { $unwind: '$commId' },
      { $unwind: '$client' },
      { $unwind: '$createdby' },
      {
        $match: {
          deleted: { $eq: false },
          'commId.BDM': String(req.decoded.userId),
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
          currency: '$paymentId.currency',
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
      select: 'name email client.country client.university employee.user_role',
      path: 'createdby client',
    });
    var singlestatus = await Status.findById(req.params.id);
    var singlepayment = await Payment.findById(req.params.id);
    var singlecomm = await Taskcomm.findOne({
      taskid: req.params.id,
    }).populate({
      select: 'name email employee.user_role',
      path: 'tasklogs.assignedby tasklogs.assignedto Admin Manager TeamLead Expert BDM',
    });
    var allComment = await Comment.find({ taskid: req.params.id }).populate({
      select: 'name',
      path: 'commentto commentby',
    });
    res.status(200).send({
      task: singletask,
      status: singlestatus,
      payment: singlepayment,
      taskcomm: singlecomm,
      comments: allComment,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.test = async (req, res, next) => {
  if (req.body.count) {
    res.send('found');
  } else {
    res.send('not found');
  }
};

//update task details
exports.put_task_update = async (req, res, next) => {
  try {
    var updatetask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        wordcount: req.body.wordcount,
        soft_deadline: req.body.soft_deadline,
        hard_deadline: req.body.hard_deadline,
        client: req.body.client,
        description: req.body.description,
      },
      { new: true }
    );
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
  } catch (e) {
    console.error(e);
  }
};

//payment according to client
// exports.get_payment_client = async (req, res, next) => {
//   try {
//     const month = req.query.month ? req.query.month : undefined;
//     const year = req.query.year ? req.query.year : undefined;
//     // const conversions = await axios.get("https://api.exchangerate-api.com/v4/latest/INR")
//     let results;
//     if (month === undefined || year === undefined) {
//       results = await User.aggregate([
//         {
//           $match: {
//             user_type: 'Client',
//             assignedTo: ObjectId(req.decoded.userId),
//           },
//         },
//         {
//           $lookup: {
//             from: 'tasks',
//             localField: '_id',
//             foreignField: 'client',
//             as: 'ClientTasks',
//           },
//         },
//         { $unwind: '$ClientTasks' },
//         {
//           $project: {
//             email: 1,
//             name: 1,
//             taskId: '$ClientTasks._id',
//           },
//         },
//         {
//           $lookup: {
//             from: 'payments',
//             localField: 'taskId',
//             foreignField: '_id',
//             as: 'taskPayments',
//           },
//         },
//         { $unwind: '$taskPayments' },
//         {
//           $project: {
//             email: 1,
//             name: 1,
//             taskId: 1,
//             currency: '$taskPayments.currency',
//             amount_paid: '$taskPayments.amount_paid',
//             amount_task: '$taskPayments.budget',
//           },
//         },
//         {
//           $group: {
//             _id: '$_id',
//             email: { $first: '$email' },
//             name: { $first: '$name' },
//             paid: {
//               $addToSet: {
//                 $concat: [{ $toString: '$amount_paid' }, ' ', '$currency', ' '],
//               },
//             },
//             amount: {
//               $addToSet: {
//                 $concat: [{ $toString: '$amount_task' }, ' ', '$currency', ' '],
//               },
//             },
//           },
//         },
//       ]);
//     } else {
//       results = await User.aggregate([
//         {
//           $match: {
//             user_type: 'Client',
//             assignedTo: ObjectId(req.decoded.userId),
//           },
//         },
//         {
//           $lookup: {
//             from: 'tasks',
//             localField: '_id',
//             foreignField: 'client',
//             as: 'ClientTasks',
//           },
//         },
//         { $unwind: '$ClientTasks' },
//         {
//           $project: {
//             email: 1,
//             name: 1,
//             taskId: '$ClientTasks._id',
//             month: { $month: '$ClientTasks.hard_deadline' },
//             year: { $year: '$ClientTasks.hard_deadline' },
//           },
//         },
//         {
//           $match: {
//             month: Number(month),
//             year: Number(year),
//           },
//         },
//         {
//           $lookup: {
//             from: 'payments',
//             localField: 'taskId',
//             foreignField: '_id',
//             as: 'taskPayments',
//           },
//         },
//         { $unwind: '$taskPayments' },
//         {
//           $project: {
//             email: 1,
//             name: 1,
//             taskId: 1,
//             currency: '$taskPayments.currency',
//             amount_paid: '$taskPayments.amount_paid',
//           },
//         },
//         {
//           $group: {
//             _id: '$_id',
//             email: { $first: '$email' },
//             name: { $first: '$name' },
//             taskIdAmount: {
//               $addToSet: {
//                 $concat: [{ $toString: '$amount_paid' }, ' ', '$currency', ' '],
//               },
//             },
//           },
//         },
//       ]);
//     }
//     const inrRates = {
//       AUD: 0.02,
//       GBP: 0.01,
//       INR: 1,
//     };
//     results.map((client) => {
//       let total = [];
//       let total1 = [];
//       total = client.paid.map((amount) => {
//         if (amount !== null) {
//           let amountSplit = amount.split(' ');
//           return parseFloat(
//             Number(amountSplit[0]) / inrRates[amountSplit[1]]
//           ).toFixed(2);
//         }
//         return 0;
//       });
//       total1 = client.amount.map((amount) => {
//         if (amount !== null) {
//           let amountSplit = amount.split(' ');
//           return parseFloat(
//             Number(amountSplit[0]) / inrRates[amountSplit[1]]
//           ).toFixed(2);
//         }
//         return 0;
//       });
//       delete client.paid;
//       delete client.amount;
//       var paidAmount = total.reduce((a, b) => Number(a) + Number(b), 0);
//       var taskAmount = total1.reduce((a, b) => Number(a) + Number(b), 0);
//       client['paidAmount'] = paidAmount;
//       client['taskAmount'] = taskAmount;
//     });
//     var sortedResults = results.sort(function (a, b) {
//       return b.paidAmount - a.paidAmount;
//     });
//     res.status(200).json({
//       data: [...sortedResults],
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.get_payment_client = async (req, res, next) => {
  try {


    let query = {};

    if (req.query.month && req.query.year) {
      var year = parseInt(req.query.year, 10);
      var month = parseInt(req.query.month, 10);
      var startOfMonth = new Date(year, month - 1, 1);
      var endOfMonth = new Date(year, month, 0, 23, 59, 59);

      query = {
        hard_deadline: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      };
    }
console.log(query)
    var clients = await User.find(
      {
        user_type: 'Client',
        is_active: true,
        assignedTo: req.decoded.userId,
      },
      {
        _id: 1,
      }
    );

    var clientIds = clients.map((client) => client._id);

    var tasks = await Task.aggregate([
      {
        $match: {
          deleted:false,
          client: { $in: clientIds },
          ...query,
        },
      },
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: '_id',
          as: 'payment',
        },
      },
      {
        $unwind: {
          path: '$payment',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          wordcount: 1,
          hard_deadline: 1,
          client: 1,
          'payment.budget': 1,
          'payment.amount_paid': 1,
          'payment.currency': 1,
          pstatus: {
            $cond: {
              if: '$payment.budget',
              then: {
                $cond: {
                  if: { $eq: ['$payment.amount_paid', 0] },
                  then: 'Unpaid',
                  else: {
                    $cond: {
                      if: {
                        $eq: ['$payment.amount_paid', '$payment.budget'],
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


      {
        $lookup: {
          from: 'users',
          localField: 'client',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $unwind: '$client',
      },
      {
        $project: {
          _id: 1,
          title: 1,
          wordcount: 1,
          hard_deadline: 1,
          'client.name': 1,
          'payment.budget': 1,
          'payment.amount_paid': 1,
          'payment.currency': 1,
          pstatus: 1,
        },
      },
    ]);
    // Check if month and year are present in query
   
    res.status(200).json({
      status: 'OK',
      records: tasks.length,
      data: tasks,
    });
  }
  catch (error) {
    console.log(error.message)
    res.status(400).send({ error: error.message });
  }
}


//hard delete client
exports.delete_task_hard = async (req, res, next) => {
  try {
    var deletetask = await Task.findByIdAndRemove(req.params.id);
    var deletepayment = await Payment.findByIdAndRemove(req.params.id);
    var deletetstatus = await Status.findByIdAndRemove(req.params.id);
    res.status(200).send('Task Deleted permanently');
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

//deliver task
exports.deliver_task = async (req, res, next) => {
  try {
    var delivertask = await Status.findByIdAndUpdate(req.params.id, {
      status: "Delivered",
    });
    res.status(200).send('Task delivered');
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
    res.status(200).send('Task Deleted');
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

//view single profile
exports.get_bd_profile = async (req, res, next) => {
  try {
    var singleemployee = await User.findById(req.decoded.userId);
    await User.populate(singleemployee, { select: 'name', path: 'assignedTo' });
    res.status(200).send(singleemployee);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//task stats
exports.get_bd_stats = async (req, res, next) => {
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
          BDM: req.decoded.userId,
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
