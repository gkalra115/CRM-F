const TaskOrder = require('../../models/order');
const User = require('../../models/user');
const jwt_decode = require('jwt-decode');
const ObjectId = require('mongoose').Types.ObjectId;
var mime = require('mime-types');

exports.post_create_task_order = async (req, res, next) => {
  try {
    const { title, description, harddeadline, wordcount } = req.body;
    const userDetail = await User.findOne({
      _id: req.decoded.userId,
    }).populate('assignedTo');
    const createOrder = new TaskOrder({
      title: title,
      description: description,
      hard_deadline: harddeadline,
      client: userDetail._id,
      wordcount: wordcount,
      reqActionBy: {
        user_role: userDetail.assignedTo.employee.user_role,
      },
    });
    await createOrder.save();
    res.status(201).json({
      id: createOrder._id,
      status: 'OK',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.post_upload_order_files = async (req, res, next) => {
  try {
    const { id } = req.params;
    let insertBriefFiles = [];
    req.files.forEach((element) => {
      insertBriefFiles.push({
        files: element.originalname,
        uploadpath:
          'https://zmyrnpacflqa.nyc3.digitaloceanspaces.com/' + element.key,
        filetype: mime.extension(element.mimetype),
        filesize: element.size,
        uploadedby: req.decoded.userId,
      });
    });
    let createOrderFiles = await TaskOrder.updateOne(
      {
        _id: ObjectId(id),
      },
      {
        $push: {
          orderFiles: {
            $each: [...insertBriefFiles],
          },
        },
      }
    );
    if (createOrderFiles.ok !== 1 || createOrderFiles.nModified !== 1) {
      await TaskOrder.findOneAndDelete({
        _id: ObjectId(id),
      });
      return res.status(400).json({
        error: 'There was a problem in pushing files to Order',
      });
    }
    res.status(201).json({
      status: 'OK',
      msg: 'Created your order successfully !!',
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.get_orders_unapproved = async (req, res, next) => {
  try {
    const getUnApprovedOrders = await TaskOrder.find({
      client: req.decoded.userId,
      'reqActionBy.actionType': 'Un-Approved',
    }).select(
      '-reqActionBy.user -reqActionBy.user_role -reqActionBy.actionAt  -deleted -updatedAt -orderFiles._id -orderFiles.uploadedby -__v'
    );
    res.json({
      status: 'OK',
      data: getUnApprovedOrders,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.get_orders_approved = async (req, res, next) => {
  try {
    const getUnApprovedOrders = await TaskOrder.find({
      client: req.decoded.userId,
      $and: [
        { 'reqActionBy.actionType': { $ne: 'Un-Approved' } },
        { 'reqActionBy.actionType': { $ne: 'Rejected' } },
      ],
    }).select(
      '-reqActionBy.user -reqActionBy.user_role -reqActionBy.actionAt -deleted -updatedAt -orderFiles._id -orderFiles.uploadedby -__v'
    );
    res.json({
      status: 'OK',
      data: getUnApprovedOrders,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.get_orders_rejected = async (req, res, next) => {
  try {
    const getRejetedOrders = await TaskOrder.find({
      client: req.decoded.userId,
      'reqActionBy.actionType': 'Rejected',
    }).select(
      '-reqActionBy.user -reqActionBy.user_role -reqActionBy.actionAt -deleted -updatedAt -orderFiles._id -orderFiles.uploadedby -__v'
    );
    res.json({
      status: 'OK',
      data: getRejetedOrders,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
