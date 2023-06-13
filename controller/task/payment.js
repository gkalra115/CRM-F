//importing models from schema
const Payment = require('../../models/payment');
const User = require('../../models/user');
const Notification = require('../../models/notification');
const { validationResult } = require('express-validator');
const { matchReqNSendNotification } = require('../../util/socket-io');

const sendNotificationForPayment = async (type, payload, req) => {
  let actionEffectsToIds = await User.find({
    user_type: 'Employee',
    'employee.user_role': 'SuperAdmin',
  }).select('_id');
  actionEffectsToIds = actionEffectsToIds.filter(function (obj) {
    return String(obj._id) !== String(req.decoded.userId);
  });
  switch (type) {
    case 'taskPaymentUpdate':
      {
        let title = `Payment for ${req.params.id} task updated.`;
        let subTitle = `by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: 'Task',
          actionTakenById: req.decoded.userId,
          resourceId: req.params.id,
          typeof: 'Payment Update',
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
          'taskPaymentUpdate'
        );
      }
      break;

    default:
      break;
  }
};

//view all payment
exports.get_payment_all = async (req, res, next) => {
  try {
    var allpayment = await Payment.find();
    res.status(200).send({
      status: 'OK',
      data: allpayment,
    });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view single payment details
exports.get_payment_single = async (req, res, next) => {
  try {
    var singlepayment = await Payment.findById(req.params.id);
    res.status(200).send(singlepayment);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

exports.get_payment_bulk = async (req, res, next) => {
  try {
    let { taskId } = req.body;
    taskId = JSON.parse(taskId);
    const updatedTask = await Payment.updateMany(
      {
        _id: {
          $in: taskId,
        },
      },
      [
        {
          $set: {
            amount_paid: '$budget',
          },
        },
      ]
    );
    if (updatedTask.nModified > 0 && updatedTask.ok > 0) {
      return res.json({
        status: 'Payments of the requested task updated.',
      });
    } else {
      throw new Error('There was some error in updating the payments');
    }
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

//update payment details
exports.put_payment_update = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return res.status(400).json({
      msg: 'error',
      errors,
    });
  }
  try {
    var { budget, amount_paid, currency } = req.body;
    var payment = await Payment.findOne({ _id: req.params.id });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    payment.budget = budget;
    payment.amount_paid = amount_paid;
    payment.currency = currency;
    payment.paymentlogs.push({
      budget,
      amount_paid,
      currency,
      createdAt: new Date(),
    });
    await payment.save();
    await sendNotificationForPayment('taskPaymentUpdate', null, req);
    res.status(200).json(payment);



    // let { locked, lockedData } = await Payment.findById({
    //   _id: req.params.id,
    // });
    // if (locked && req.decoded.userDetails.user_role === 'BDM') {
    //   return res.status(400).json({
    //     msg: 'error',
    //     errors: [
    //       {
    //         msg: 'The task payment has not been approved yet',
    //       },
    //     ],
    //   });
    // }
    // let updateParams = {};
    // if (
    //   req.body.approved &&
    //   req.decoded.userDetails.user_role === 'SuperAdmin'
    // ) {
    //   updateParams = {
    //     budget: lockedData.budget,
    //     amount_paid: lockedData.amount_paid,
    //     currency: lockedData.currency,
    //     locked: false,
    //     lockedData: null,
    //   };
    // } else {
    //   updateParams = {
    //     budget: Number(req.body.budget),
    //     amount_paid: Number(req.body.amount_paid),
    //     currency: req.body.currency,
    //     locked: false,
    //     lockedData: null,
    //   };
    // }
    // if (req.decoded.userDetails.user_role === 'BDM') {
    //   updateParams = {
    //     locked: true,
    //     lockedData: {
    //       budget: Number(req.body.budget),
    //       amount_paid: Number(req.body.amount_paid),
    //       currency: req.body.currency,
    //       updateTime: new Date(),
    //     },
    //   };
    // }
    // var updatepayment = await Payment.findByIdAndUpdate(
    //   req.params.id,
    //   {
    //     ...updateParams,
    //   },
    //   { new: true }
    // );




    // var paymentlogs = {
    //   budget: Number(req.body.budget),
    //   amount_paid: Number(req.body.amount_paid),
    //   currency: req.body.currency
    // };
    
    
    // res.status(200).send(updatepayment);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};
