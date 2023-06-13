var mime = require("mime-types");

//importing models from schema
const Comment = require("../../models/comments");
const User = require("../../models/user");
const Notification = require("../../models/notification");
const { validationResult } = require("express-validator");
const { matchReqNSendNotification } = require("../../util/socket-io");

const sendNotificationForComment = async (type, payload, req) => {
  let actionEffectsToIds = await User.find({
    user_type: "Employee",
    "employee.user_role": "SuperAdmin",
  }).select("_id");
  actionEffectsToIds = actionEffectsToIds.filter(function (obj) {
    return String(obj._id) !== String(req.decoded.userId);
  });
  switch (type) {
    case "taskCommentCreate":
      {
        actionEffectsToIds = [...actionEffectsToIds, payload];
        let title = `Comment on ${req.params.id} task.`;
        let subTitle = `by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: "Task",
          actionTakenById: req.decoded.userId,
          resourceId: req.params.id,
          typeof: "Comment",
          actionEffectsToId: actionEffectsToIds,
          title: title,
          subTitle: subTitle,
          action: "/su/task/" + req.params.id,
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) {
          return String(el._id);
        });
        await NotificationCreate.save();
        matchReqNSendNotification(
          actionEffectsToIds,
          { title, subTitle, action: "/su/task/" + req.params.id },
          "taskCommentCreate"
        );
      }
      break;

    default:
      break;
  }
};
//create Comment
exports.post_create_comment = async (req, res, next) => {
  var { errors } = validationResult(req);
  if (errors.length > 0) {
    res.status(400).json({
      msg: "error",
      errors,
    });
  }
  let insertCommentFile = {};
  if (!!req.file) {
    let { originalname, key, mimetype, size } = req.file;
    insertCommentFile["files"] = originalname;
    insertCommentFile["uploadpath"] =
      "https://zmyrnpacflqa.nyc3.digitaloceanspaces.com/" + key;
    insertCommentFile["filetype"] = mime.extension(mimetype);
    insertCommentFile["filesize"] = size;
  }
  const comment = new Comment({
    commentby: req.decoded.userId,
    taskid: req.params.id,
    commentFile: insertCommentFile,
    commentto: req.body.commentto,
    comment: req.body.comment,
  });

  try {
    var commentsaved = await comment.save();
    await User.populate(commentsaved, {
      select: "name createdAt comment",
      path: "commentby commentto",
    });
    await sendNotificationForComment(
      "taskCommentCreate",
      { _id: req.body.commentto },
      req
    );
    res.status(201).send({
      status: "created",
      data: commentsaved,
    });
  } catch (e) {
    //res.status(400).send({ error: e.errmsg });
  }
};

//view all Comment
exports.get_comment_all = async (req, res, next) => {
  try {
    var allComment = await Comment.find();
    res.status(200).send({
      status: "OK",
      data: allComment,
    });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view all Comment of particular task
exports.get_comment_task = async (req, res, next) => {
  try {
    var allComment = await Comment.find({ taskid: req.params.taskid });
    res.status(200).send({
      status: "OK",
      data: allComment,
    });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

// //view single client details
// exports.get_client_single = async (req, res, next) => {
//   try {
//     var singleclient = await User.findById(req.params.id);
//     res.status(200).send(singleclient);
//   } catch (e) {
//     res.status(400).send({ error: e.errmsg });
//   }
// };

// //update client details
// exports.put_client_update = async (req, res, next) => {
//   try {
//     var updateclient = await User.findByIdAndUpdate(
//       req.params.id,
//       {
//         email: req.body.email,
//         name: req.body.name,
//         phone: req.body.phone,
//         user_type: req.body.user_type,
//         is_active: req.body.is_active,
//         client: {
//           country: req.body.country,
//           university: req.body.university
//         }
//       },
//       { new: true }
//     );
//     res.status(200).send(updateclient);
//   } catch (e) {
//     res.status(400).send({ error: e.errmsg });
//   }
// };

// //hard delete client
// exports.delete_client_hard = async (req, res, next) => {
//   try {
//     var deleteuser = await User.findByIdAndRemove(req.params.id);
//     res.status(200).send("User Deleted permanently");
//   } catch (e) {
//     res.status(400).send({ error: e.errmsg });
//   }
// };

// //soft delete client
// exports.delete_client_soft = async (req, res, next) => {
//   try {
//     var deleteuser = await User.findByIdAndUpdate(req.params.id, {
//       is_active: false
//     });
//     res.status(200).send("User Deleted");
//   } catch (e) {
//     res.status(400).send({ error: e.errmsg });
//   }
// };
