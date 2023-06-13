const Task = require('../../models/task');
const TaskOrder = require('../../models/order');
const Status = require('../../models/status');
const Payment = require('../../models/payment');
const Comment = require('../../models/comments');
const Taskcomm = require('../../models/comm');
const Notification = require('../../models/notification');
const User = require('../../models/user');
const { ObjectId } = require('mongoose').Types;

exports.get_client_orders = async (req, res, next) => {
  try {
    const getClientOrders = await TaskOrder.find({})
      .select(
        '-reqActionBy.user -reqActionBy.user_role -reqActionBy.actionAt -__v'
      )
      .populate({
        path: 'client',
        select: 'name',
      });
    res.json({
      data: getClientOrders,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.reject_client_order = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rejectClientOrder = await TaskOrder.updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          reqActionBy: {
            user: req.decoded.userId,
            actionAt: new Date(),
            actionType: 'Rejected',
          },
        },
      }
    );
    if (rejectClientOrder.ok !== 1 || rejectClientOrder.nModified !== 1) {
      req.status(400).json({
        error: 'There was an error rejecting this order',
      });
    }
    res.json({
      status: 'OK',
      msg: 'Rejeted the client order successfully',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
