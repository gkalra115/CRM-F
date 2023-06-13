const User = require('../models/user');
const Task = require('../models/task');
const Notification = require('../models/notification');
const ObjectId = require('mongoose').Types.ObjectId;

exports.put_read_notification = async (req, res, next) => {
  try {
    const objectifyIds = [];
    req.body.data.forEach((e) => {
      objectifyIds.push(ObjectId(e));
    });
    const updateStatus = await Notification.updateMany(
      {
        _id: { $in: objectifyIds },
        'actionEffectsToId._id': req.decoded.userId,
      },
      {
        $set: {
          'actionEffectsToId.$.readAt': new Date(),
          'actionEffectsToId.$.flag': true,
        },
      },
      { multi: true }
    );
    if (updateStatus.nModified < 1 && updateStatus.ok < 1) {
      throw 'Some error in reading the notification(s)';
    }
    res.send({
      msg: 'The notification(s) was read successfully',
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
};

exports.put_starred_notification = async (req, res, next) => {
  try {
    let message;
    const objectifyIds = [];
    req.body.data.forEach((e) => {
      objectifyIds.push(ObjectId(e));
    });
    const starred = await Notification.updateMany(
      {
        _id: { $in: objectifyIds },
        'actionEffectsToId._id': req.decoded.userId,
      },
      {
        $set: {
          'actionEffectsToId.$.starred': req.body.starred,
        },
      },
      { multi: true }
    );
    if (req.body.starred) {
      message = 'The notification(s) was starred successfully';
    } else {
      message = 'The notification(s) was unstarred successfully';
    }
    if (starred.nModified < 1 && starred.ok < 1) {
      throw 'Some error in reading the notification(s)';
    }
    res.send({
      msg: message,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

exports.put_unread_notification = async (req, res, next) => {
  try {
    const objectifyIds = [];
    req.body.data.forEach((e) => {
      objectifyIds.push(ObjectId(e));
    });
    const updateStatus = await Notification.updateMany(
      {
        _id: { $in: objectifyIds },
        'actionEffectsToId._id': req.decoded.userId,
      },
      {
        $set: {
          'actionEffectsToId.$.readAt': null,
          'actionEffectsToId.$.flag': false,
        },
      }
    );
    if (updateStatus.nModified < 1 && updateStatus.ok < 1) {
      throw 'Some error in reading the notification(s)';
    }
    res.send({
      msg: 'The notification(s) was unread successfully',
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
};

exports.get_all_notification = async (req, res, next) => {
  try {
    let skipnumber = parseInt(req.query.start);
    let limitnumber = parseInt(req.query.length);
    let searchQueryFilter = {};
    switch (req.query.type) {
      case 'all':
        searchQueryFilter = {};
        break;
      case 'read':
        searchQueryFilter = { flag: true };
        break;
      case 'unread':
        searchQueryFilter = { flag: false };
        break;
      case 'starred':
        searchQueryFilter = { starred: true };
        break;
      case 'unstarred':
        searchQueryFilter = { starred: false };
        break;
      default:
        break;
    }
    let searchTypeNotification =
      !!req.query.columns[1].search &&
      req.query.columns[1].search.value != '' &&
      req.query.columns[1].search.value === 'read'
        ? { flag: true }
        : { flag: false };
    if (
      !!req.query.columns[1].search &&
      req.query.columns[1].search.value === ''
    ) {
      searchTypeNotification = {};
    }
    let searchQuery = !!req.query.search.value
      ? {
          $or: [
            {
              title: {
                $regex: new RegExp(req.query.search.value, 'gi'),
              },
            },
            {
              subTitle: {
                $regex: new RegExp(req.query.search.value, 'gi'),
              },
            },
          ],
        }
      : {};
    const countlength = await Notification.find({
      actionEffectsToId: {
        $elemMatch: { _id: { $eq: ObjectId(req.decoded.userId) } },
      },
      actionTakenById: { $nin: [String(req.decoded.userId)] },
    }).countDocuments();
    let allNotifications = await Notification.aggregate([
      {
        $match: {
          actionEffectsToId: {
            $elemMatch: {
              _id: {
                $eq: ObjectId(req.decoded.userId),
              },
              ...searchTypeNotification,
              ...searchQueryFilter,
            },
          },
          actionTakenById: { $nin: [String(req.decoded.userId)] },
          ...searchQuery,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skipnumber,
      },
      {
        $limit: limitnumber,
      },
      {
        $project: {
          title: 1,
          subTitle: 1,
          action: 1,
          actionEffectsToId: {
            $filter: {
              input: '$actionEffectsToId',
              as: 'item',
              cond: { $eq: ['$$item._id', ObjectId(req.decoded.userId)] },
            },
          },
          // actionEffectsToId: 1,
          createdAt: 1,
          starred: 1,
        },
      },
    ]);
    allNotifications = allNotifications.map((el) => {
      el['action'] = el['action'].replace(
        '/su/task',
        `/${req.decoded.userDetails.user_role
          .substring(0, 2)
          .toLowerCase()}/view`
      );
      return el;
    });
    console.log(allNotifications);
    res.send({
      data: allNotifications,
      recordsTotal: countlength,
      recordsFiltered: countlength,
    });
  } catch (error) {
    res.send({ error: error.message });
  }
};
