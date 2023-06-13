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
exports.get_dashboard_client = (req, res, next) => {
  res.render('clients/dashboard', {
    pageTitle: 'CL | Dashboard',
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
    res.status(400).send({ error: e.errmsg });
  }
};

//view all clients
exports.get_client_all = async (req, res, next) => {
  try {
    var allclients = await User.find(
      {
        $and: [
          { user_type: { $eq: 'Client' } },
          { is_active: true },
          { assignedTo: req.decoded.userId },
        ],
      },
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
    );
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
      _id: ObjectId(req.params.id),
      user_type: { $eq: 'Client' },
      assignedTo: req.decoded.userId,
    });
    let finance = [];
    if (!req.query.month) {
      finance = await Task.aggregate([
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
            client: ObjectId(req.params.id),
            deleted: false,
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
      finance = await Task.aggregate([
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
            client: ObjectId(req.params.id),
            deleted: false,
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
    if (!singleclient) {
      return res.status(400).send('No Client found');
    }
    console.log(finance);
    res.status(200).send({ singleclient, finance });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//update client details
exports.put_client_update = async (req, res, next) => {
  try {
    const findClient = await User.findOne({
      _id: ObjectId(req.params.id),
      createdby: req.decoded.userId,
    });
    if (!findClient) {
      throw Error({
        message: 'You are not Authorised to update this client',
      });
    }
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
