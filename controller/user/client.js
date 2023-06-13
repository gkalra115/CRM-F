//importing models from schema
const User = require('../../models/user');
const Task = require('../../models/task');
const ObjectId = require('mongoose').Types.ObjectId;
const Comm = require('../../models/comm');
const Status = require('../../models/status');
const Notification = require('../../models/notification');
const { matchReqNSendNotification } = require('../../util/socket-io');

//importing other installed libraries
const bcrypt = require('bcrypt');
var generator = require('generate-password');
const { validationResult } = require('express-validator');

const sendNotificationForClient = async (type, payload, req) => {
  let actionEffectsToIds = await User.find({
    user_type: 'Employee',
    'employee.user_role': { $in: ['SuperAdmin', 'Admin'] },
  }).select('_id');
  actionEffectsToIds = actionEffectsToIds.filter(function (obj) {
    return String(obj._id) !== String(req.decoded.userId);
  });
  switch (type) {
    case 'taskClientCreate':
      {
        let title = `${req.body.name} client created.`;
        let subTitle = `by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: 'User',
          actionTakenById: req.decoded.userId,
          resourceId: payload,
          typeof: 'Client Create',
          actionEffectsToId: actionEffectsToIds,
          title: title,
          subTitle: subTitle,
          action: '/su/clients/' + payload,
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) {
          return String(el._id);
        });
        await NotificationCreate.save();
        matchReqNSendNotification(
          actionEffectsToIds,
          { title, subTitle },
          'taskClientCreate'
        );
      }
      break;
    case 'taskClientEdit':
      {
        let title = `${req.body.name} client edited.`;
        let subTitle = `by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: 'User',
          actionTakenById: req.decoded.userId,
          resourceId: req.params.id,
          typeof: 'Client Edit',
          actionEffectsToId: actionEffectsToIds,
          title: title,
          subTitle: subTitle,
          action: '/su/clients/' + payload,
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) {
          return String(el._id);
        });
        await NotificationCreate.save();
        matchReqNSendNotification(
          actionEffectsToIds,
          { title, subTitle },
          'taskClientEdit'
        );
      }
      break;

    default:
      break;
  }
};

// client dashboard
exports.get_home_client = (req, res, next) => {
  res.render('clients/home', {
    pageTitle: 'Home',
  });
};

exports.get_comingsoon_client = (req, res, next) => {
  res.render('clients/soon', {
    pageTitle: 'Coming Soon',
  });
};

exports.get_askme_client = (req, res, next) => {
  res.render('clients/askmeanything', {
    pageTitle: 'Ask me Anything',
  });
};

exports.get_createcode_client = (req, res, next) => {
  res.render('clients/generatecode', {
    pageTitle: 'Generate code',
  });
};

exports.get_createcodesummary_client = (req, res, next) => {
  res.render('clients/codesummary', {
    pageTitle: 'Generate code Summary',
  });
};

exports.get_myaccount_client = (req, res, next) => {
  res.render('clients/account', {
    pageTitle: 'My Account',
  });
};
//create client
exports.post_create_client = async (req, res, next) => {
  
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return res.status(400).json({
      msg: 'error',
      errors,
    });
  }
  var password = await generator.generate({
    length: 10,
    numbers: true,
  });
  var decryptedpass = await bcrypt.hash(password, 10);
  const client = new User({
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
    user_type: 'Client',
    is_active: req.body.is_active,
    password: decryptedpass,
    originalpass: password,
    client: {
      country: req.body.country,
      university: req.body.university,
    },
    assignedTo: req.decoded.userId,
    createdby: req.decoded.userId,
  });

  try {
    var clientsaved = await client.save();
    
    await sendNotificationForClient('taskClientCreate', clientsaved._id, req);
    res.status(201).send({
      status: 'created',
      data: clientsaved,
    });
  } catch (e) {
    console.log(e)
    res.status(400).send({ error: e.errmsg });
  }
};

//view all clients
exports.get_client_all = async (req, res, next) => {
  try {
    var allclients = await User.find(
      { $and: [{ user_type: { $eq: 'Client' } }, { is_active: true }] },
      {
        _id: 1,
        email: 1,
        name: 1,
        phone: 1,
        user_type: 1,
        client: 1,
        assignedTo: 1,
        is_active: 1,
      }
    ).populate({
      path: 'assignedTo',
      select: 'name',
    });
    res.status(200).json({
      status: 'OK',
      data: allclients,
    });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view single client details
exports.get_client_single = async (req, res, next) => {
  try {
    var singleclient = await User.findOne({
      _id: req.params.id,
      user_type: { $eq: 'Client' },
    }).populate({
      path: 'assignedTo',
      select: 'name',
    });
    if (singleclient) {
      res.status(200).send(singleclient);
    } else {
      res.status(400).send('No Client found');
    }
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//update client details
exports.put_client_update = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.json({
        msg: 'error',
        errors,
      });
    }
    var updateclient = await User.findByIdAndUpdate(
      req.params.id,
      {
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        createdby: req.decoded.userId,
        user_type: 'Client',
        is_active: req.body.is_active,
        client: {
          country: req.body.country,
          university: req.body.university,
        },
      },
      { new: true }
    );
    await sendNotificationForClient('taskClientEdit', null, req);
    res.status(200).send(updateclient);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//assign client to bdm
exports.assign_client_bdm = async (req, res, next) => {
  try {
    const { id, empId } = req.params;
    const checkClient = await User.findOne({
      _id: ObjectId(id),
      client: { $exists: true },
      is_active: true,
    });
    const checkUser = await User.findOne({
      _id: ObjectId(empId),
      employee: { $exists: true },
      is_active: true,
    });
    if (!checkClient || !checkUser) {
      return res.status(400).json({
        msg: 'No such client available to assign',
      });
    }
    const updateClient = await User.updateOne(
      {
        _id: checkClient._id,
      },
      {
        $set: {
          assignedTo: checkUser._id,
        },
      }
    );
    let getClientTasks = await Task.aggregate([
      {
        $match: { client: checkClient._id },
      },
      {
        $group: {
          _id: null,
          total: { $push: '$_id' },
        },
      },
    ]);
    const updateTaskComms = await Comm.updateMany(
      {
        taskid: { $in: getClientTasks[0].total },
      },
      {
        $set: {
          BDM: checkUser._id,
        },
      }
    );
    console.log(updateTaskComms, getClientTasks[0].total.length);
    if (
      updateClient.n != 1 ||
      updateClient.nModified != 1 ||
      updateTaskComms.n != getClientTasks[0].total.length ||
      updateTaskComms.nModified != getClientTasks[0].total.length
    ) {
      return res.status(400).json({
        msg: 'No such client available to assign',
      });
    }
    return res.status(200).json({
      status: 'OK',
      msg: 'Assigned Client to the BDM successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.get_client_finance = async (req, res, next) => {
  try {
    var clientid = req.params.clientid;
    if (req.query.month == null) {
      var finance = await Task.aggregate([
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: '_id',
            as: 'payments',
          },
        },
        { $unwind: '$payments' },
        {
          $match: {
            $and: [{ client: ObjectId(clientid) }, { deleted: false }],
          },
        },
        {
          $project: {
            currency: '$payments.currency',
            amount_paid: '$payments.amount_paid',
            task_budget: '$payments.budget',
            wordcount: 1,
            month: { $month: '$hard_deadline' },
            year: { $year: '$hard_deadline' },
          },
        },
        {
          $group: {
            _id: '$currency',
            totalamount: {
              $sum: '$task_budget',
            },
            totalpaid: {
              $sum: '$amount_paid',
            },
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
      var finance = await Task.aggregate([
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: '_id',
            as: 'payments',
          },
        },
        { $unwind: '$payments' },
        {
          $match: {
            $and: [{ client: ObjectId(clientid) }, { deleted: false }],
          },
        },
        {
          $project: {
            currency: '$payments.currency',
            amount_paid: '$payments.amount_paid',
            task_budget: '$payments.budget',
            wordcount: 1,
            month: { $month: '$hard_deadline' },
            year: { $year: '$hard_deadline' },
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
            _id: '$currency',
            totalamount: {
              $sum: '$task_budget',
            },
            totalpaid: {
              $sum: '$amount_paid',
            },
            wordcount: {
              $sum: '$wordcount',
            },
            totaltask: { $sum: 1 },
          },
        },
      ]);
    }
    res.send(finance);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

//hard delete client
exports.delete_client_hard = async (req, res, next) => {
  try {
    var deleteuser = await User.findByIdAndRemove(req.params.id);
    res.status(200).send('User Deleted permanently');
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//soft delete client
exports.delete_client_soft = async (req, res, next) => {
  try {
    var deleteuser = await User.findByIdAndUpdate(req.params.id, {
      is_active: false,
    });
    res.status(200).send('User Deleted');
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};
